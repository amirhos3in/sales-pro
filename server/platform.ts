import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { WebSocketServer, type WebSocket } from "ws";
import { getDatabase } from "@/db/client";
import { gradeLesson, openSession, seedCurriculum, spendSeconds, userByToken } from "@/db/repo";
import { rms16, speakableCounter, transcribePcm } from "@/server/stt";

const port = Number(process.env.PLATFORM_PORT || 43124);
const hits = new Map<string, number[]>();

function send(res: ServerResponse, status: number, body: unknown) {
  const raw = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(raw);
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

function tokenOf(req: IncomingMessage) {
  const header = req.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) return header.slice(7);
  return "";
}

function allow(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 30) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

async function main() {
  const database = await getDatabase();
  await seedCurriculum(database.db);
  const sockets = new WeakMap<WebSocket, { userId: string; pcm: Buffer[]; pending: number; lastText: string; variant: number }>();

  const server = createServer(async (req, res) => {
    try {
      if (!req.url || !req.method) return send(res, 404, { error: "missing" });
      if (req.method === "OPTIONS") return send(res, 204, {});
      const url = new URL(req.url, "http://127.0.0.1");
      if (req.method === "GET" && url.pathname === "/api/platform/health") {
        return send(res, 200, {
          ok: true,
          driver: database.driver,
          stt: Boolean(process.env.OPENAI_API_KEY?.trim()),
        });
      }
      if (req.method === "POST" && url.pathname === "/api/platform/session") {
        const body = await readJson(req);
        const phone = String(body.phone ?? "");
        const name = String(body.name ?? "کاربر نکس‌سل");
        const plan = body.plan === "eco" || body.plan === "plus" || body.plan === "pro" ? body.plan : null;
        if (phone.replace(/\D/g, "").length < 8) return send(res, 400, { error: "phone" });
        const session = await openSession(database.db, {
          phone,
          name,
          email: typeof body.email === "string" ? body.email : null,
          plan,
          active: Boolean(body.active),
        });
        const me = await userByToken(database.db, session.token);
        return send(res, 200, { token: session.token, user: me?.user ?? null, subscription: me?.subscription ?? null });
      }
      if (req.method === "GET" && url.pathname === "/api/platform/me") {
        const me = await userByToken(database.db, tokenOf(req));
        if (!me) return send(res, 401, { error: "auth" });
        const quota = me.subscription ? Math.max(0, me.subscription.quotaSeconds - me.subscription.usedSeconds) : 0;
        return send(res, 200, { user: me.user, subscription: me.subscription, remainingSeconds: quota });
      }
      if (req.method === "POST" && url.pathname === "/api/platform/quiz") {
        const me = await userByToken(database.db, tokenOf(req));
        if (!me) return send(res, 401, { error: "auth" });
        const body = await readJson(req);
        const answers = Array.isArray(body.answers) ? body.answers.map((item) => Number(item)) : [];
        const result = await gradeLesson(database.db, me.user.id, String(body.lessonId ?? ""), answers);
        if ("error" in result) return send(res, 403, result);
        return send(res, 200, result);
      }
      if (req.method === "POST" && url.pathname === "/api/platform/counter") {
        const ip = req.socket.remoteAddress ?? "local";
        if (!allow(ip)) return send(res, 429, { error: "rate" });
        const body = await readJson(req);
        const text = String(body.text ?? "");
        const variant = Number(body.variant ?? 0);
        const card = await speakableCounter(text, variant);
        return send(res, 200, card);
      }
      return send(res, 404, { error: "not-found" });
    } catch (error) {
      console.error(error);
      if (!res.headersSent) send(res, 500, { error: "server" });
    }
  });

  const wss = new WebSocketServer({ noServer: true });
  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== "/api/copilot/stream") {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  wss.on("connection", async (ws, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    const me = await userByToken(database.db, url.searchParams.get("token") ?? "");
    if (!me) {
      ws.send(JSON.stringify({ type: "error", message: "برای سهمیهٔ کوپایلوت یک‌بار وارد شوید." }));
      ws.close();
      return;
    }
    sockets.set(ws, { userId: me.user.id, pcm: [], pending: 0, lastText: "", variant: 0 });
    const quota = me.subscription ? Math.max(0, me.subscription.quotaSeconds - me.subscription.usedSeconds) : 0;
    ws.send(JSON.stringify({ type: "quota", remainingSeconds: quota, stt: Boolean(process.env.OPENAI_API_KEY?.trim()) }));
    ws.send(JSON.stringify({ type: "status", phase: "idle" }));

    ws.on("message", async (data) => {
      const state = sockets.get(ws);
      if (!state) return;
      let message: { type?: string; pcm?: string; text?: string; source?: string };
      try {
        message = JSON.parse(String(data)) as typeof message;
      } catch {
        return;
      }
      if (message.type === "audio" && message.pcm) {
        const chunk = Buffer.from(message.pcm, "base64");
        state.pending += chunk.length / 2 / 16000;
        if (state.pending >= 1) {
          const whole = Math.floor(state.pending);
          state.pending -= whole;
          const spent = await spendSeconds(database.db, state.userId, whole);
          ws.send(JSON.stringify({ type: "quota", remainingSeconds: spent.remaining }));
          if (!spent.allowed) {
            ws.send(JSON.stringify({ type: "error", message: "سهمیه این ماه تمام شد. پلن کوپایلوت را تمدید کنید." }));
            ws.send(JSON.stringify({ type: "status", phase: "idle" }));
            return;
          }
        }
        ws.send(JSON.stringify({ type: "status", phase: "listening" }));
        if (rms16(chunk) < 0.02) return;
        state.pcm.push(chunk);
        const buffered = Buffer.concat(state.pcm);
        if (buffered.length < 16000 * 2) return;
        state.pcm = [];
        ws.send(JSON.stringify({ type: "status", phase: "analyzing" }));
        const text = await transcribePcm(buffered);
        if (!text) {
          ws.send(JSON.stringify({ type: "status", phase: "listening" }));
          return;
        }
        await reply(ws, state, text, 0);
        return;
      }
      if (message.type === "transcript" && message.text) {
        ws.send(JSON.stringify({ type: "status", phase: "analyzing" }));
        await reply(ws, state, message.text, 0);
        return;
      }
      if (message.type === "regenerate" && state.lastText) {
        state.variant += 1;
        await reply(ws, state, state.lastText, state.variant);
      }
    });
  });

  async function reply(
    ws: WebSocket,
    state: { lastText: string; variant: number },
    text: string,
    variant: number,
  ) {
    state.lastText = text;
    state.variant = variant;
    const card = await speakableCounter(text, variant);
    ws.send(JSON.stringify({ type: "transcript", text }));
    if (!card.matched) {
      ws.send(JSON.stringify({ type: "status", phase: "listening" }));
      return;
    }
    ws.send(JSON.stringify({ type: "objection", ...card }));
    ws.send(JSON.stringify({ type: "status", phase: "ready" }));
  }

  server.listen(port, "0.0.0.0", () => {
    console.log(`platform ${database.driver} http://0.0.0.0:${port}`);
  });
}

void main();

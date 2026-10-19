const TOKEN_KEY = "nexsell-platform-token";

export function platformHttp(path: string) {
  const configured = process.env.NEXT_PUBLIC_PLATFORM_URL?.replace(/\/$/, "");
  if (configured) return `${configured}${path}`;
  if (typeof window === "undefined") return path;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return `http://${host}:43124${path}`;
  return path;
}

export function platformWs(token: string) {
  const configured = process.env.NEXT_PUBLIC_PLATFORM_URL?.replace(/\/$/, "");
  const base = configured ? configured.replace(/^http/, "ws") : `ws://${window.location.hostname}:43124`;
  return `${base}/api/copilot/stream?token=${encodeURIComponent(token)}`;
}

export function readPlatformToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export async function ensurePlatformSession(input: {
  phone: string;
  name: string;
  plan?: "eco" | "plus" | "pro" | null;
  active?: boolean;
}) {
  const response = await fetch(platformHttp("/api/platform/session"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("session");
  const body = (await response.json()) as {
    token: string;
    subscription?: { tier?: string; quotaSeconds?: number; usedSeconds?: number } | null;
  };
  localStorage.setItem(TOKEN_KEY, body.token);
  return body;
}

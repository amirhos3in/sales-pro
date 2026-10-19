import { counterFor, type CounterCard } from "@/lib/copilot/playbook";

export function pcm16ToWav(pcm: Buffer, sampleRate = 16000) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export function rms16(pcm: Buffer) {
  if (pcm.length < 2) return 0;
  let sum = 0;
  const samples = Math.floor(pcm.length / 2);
  for (let i = 0; i < samples; i += 1) {
    const value = pcm.readInt16LE(i * 2) / 32768;
    sum += value * value;
  }
  return Math.sqrt(sum / samples);
}

export async function transcribePcm(pcm: Buffer) {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key || pcm.length < 3200) return null;
  const wav = pcm16ToWav(pcm);
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(wav)], { type: "audio/wav" }), "chunk.wav");
  form.append("model", process.env.OPENAI_STT_MODEL || "whisper-1");
  form.append("language", "fa");
  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { text?: string };
  return body.text?.trim() || null;
}

export async function speakableCounter(text: string, variant = 0): Promise<CounterCard & { source: "playbook" | "llm" }> {
  const card = counterFor(text, variant);
  if (!card.matched) return { ...card, source: "playbook" };
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return { ...card, source: "playbook" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1600);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "تو مربی فروش تلفنی فارسی هستی. فقط وقتی اعتراض یا سؤال خرید شنیدی جواب بده. خروجی JSON با کلیدهای technique و say. say حداکثر دو جملهٔ محاوره‌ای و آمادهٔ گفتن پشت تلفن باشد. technique حداکثر چهار کلمه.",
          },
          { role: "user", content: `اعتراض: ${text}\nتکنیک پیشنهادی: ${card.technique}` },
        ],
      }),
    });
    if (!response.ok) return { ...card, source: "playbook" };
    const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = body.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)) as { technique?: string; say?: string };
    if (!parsed.say) return { ...card, source: "playbook" };
    return {
      ...card,
      technique: parsed.technique?.trim() || card.technique,
      say: parsed.say.trim(),
      source: "llm",
    };
  } catch {
    return { ...card, source: "playbook" };
  } finally {
    clearTimeout(timer);
  }
}

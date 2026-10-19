export function downsampleTo16k(input: Float32Array, sampleRate: number) {
  const ratio = sampleRate / 16000;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const pcm = new Int16Array(length);
  for (let index = 0; index < length; index += 1) {
    const start = Math.floor(index * ratio);
    const end = Math.min(input.length, Math.floor((index + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let cursor = start; cursor < end; cursor += 1) {
      sum += input[cursor] ?? 0;
      count += 1;
    }
    const sample = Math.max(-1, Math.min(1, sum / (count || 1)));
    pcm[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return pcm;
}

export function pcmToBase64(pcm: Int16Array) {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  for (const value of bytes) binary += String.fromCharCode(value);
  return btoa(binary);
}

export async function openCallStream(source: "voip" | "ambient") {
  if (source === "voip") {
    const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    const audio = display.getAudioTracks()[0];
    if (!audio) {
      display.getTracks().forEach((track) => track.stop());
      throw new Error("no-system-audio");
    }
    display.getVideoTracks().forEach((track) => track.stop());
    return new MediaStream([audio]);
  }
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
    video: false,
  });
}

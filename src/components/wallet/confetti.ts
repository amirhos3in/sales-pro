export function burstConfetti() {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("data-confetti", "true");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#D4AF37", "#F3E5AB", "#7928CA", "#E5C07B", "#FFFFFF"];
  const pieces = Array.from({ length: 96 }, () => ({
    x: canvas.width * (0.35 + Math.random() * 0.3),
    y: canvas.height * 0.32,
    vx: (Math.random() - 0.5) * 16,
    vy: Math.random() * -13 - 3,
    g: 0.22 + Math.random() * 0.16,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)] ?? "#D4AF37",
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.28,
  }));
  const start = performance.now();
  function frame(now: number) {
    if (!ctx || now - start > 1700) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const piece of pieces) {
      piece.vy += piece.g;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rot += piece.vr;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rot);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

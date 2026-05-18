import { useEffect, useRef } from "react";

export function AnimatedAIChat() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf;

    // Stars
    const STAR_COUNT = 160;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating orbs
    const orbs = [
      { x: W * 0.2,  y: H * 0.3,  r: 320, color: "99,102,241",  speed: 0.0004, phase: 0 },
      { x: W * 0.8,  y: H * 0.2,  r: 260, color: "139,92,246",  speed: 0.0006, phase: 1.5 },
      { x: W * 0.6,  y: H * 0.75, r: 200, color: "16,185,129",  speed: 0.0005, phase: 3 },
      { x: W * 0.1,  y: H * 0.8,  r: 180, color: "74,144,226",  speed: 0.0003, phase: 4.5 },
    ];

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Deep space base
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
      bg.addColorStop(0,   "rgba(8,6,30,1)");
      bg.addColorStop(0.5, "rgba(5,4,20,1)");
      bg.addColorStop(1,   "rgba(2,2,10,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Orbs
      orbs.forEach(o => {
        const ox = o.x + Math.sin(t * o.speed + o.phase) * 60;
        const oy = o.y + Math.cos(t * o.speed * 0.7 + o.phase) * 40;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0,   `rgba(${o.color},0.18)`);
        g.addColorStop(0.5, `rgba(${o.color},0.07)`);
        g.addColorStop(1,   `rgba(${o.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.028)";
      ctx.lineWidth = 1;
      const GRID = 70;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Stars
      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t++;
      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      orbs[0].x = W * 0.2;  orbs[0].y = H * 0.3;
      orbs[1].x = W * 0.8;  orbs[1].y = H * 0.2;
      orbs[2].x = W * 0.6;  orbs[2].y = H * 0.75;
      orbs[3].x = W * 0.1;  orbs[3].y = H * 0.8;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ai-canvas" />;
}

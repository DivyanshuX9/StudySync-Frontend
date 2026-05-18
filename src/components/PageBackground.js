import { useEffect, useRef } from "react";
import { useWeather } from "../context/WeatherContext";

const TONE_PALETTES = {
  sunny_day:           ["255,200,80",  "255,160,40",  "255,240,120"],
  sunny_night:         ["80,100,200",  "40,60,160",   "100,80,220"],
  partly_cloudy_day:   ["100,160,240", "160,200,255", "80,180,200"],
  partly_cloudy_night: ["60,80,160",   "40,60,140",   "80,100,200"],
  cloudy_day:          ["120,140,160", "160,175,190", "100,130,160"],
  cloudy_night:        ["40,50,70",    "30,40,60",    "50,65,85"],
  overcast_day:        ["100,115,135", "130,145,160", "90,110,130"],
  overcast_night:      ["25,32,45",    "20,28,40",    "35,45,60"],
  drizzle_day:         ["80,120,160",  "100,150,190", "60,110,150"],
  drizzle_night:       ["20,40,70",    "15,30,55",    "30,50,80"],
  rain_day:            ["50,80,120",   "40,70,110",   "60,90,130"],
  rain_night:          ["10,20,40",    "8,16,32",     "15,28,50"],
  thunderstorm_day:    ["40,50,80",    "60,70,100",   "80,60,120"],
  thunderstorm_night:  ["8,10,24",     "12,15,35",    "20,15,45"],
  snow_day:            ["180,210,240", "200,225,250", "160,200,235"],
  snow_night:          ["30,45,80",    "20,35,65",    "40,55,90"],
};

export default function PageBackground() {
  const canvasRef = useRef(null);
  const { toneKey } = useWeather();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let raf;

    const palette   = TONE_PALETTES[toneKey] || TONE_PALETTES["sunny_day"];
    const isDark    = toneKey.endsWith("_night") ||
                      toneKey.startsWith("thunderstorm") ||
                      toneKey.startsWith("rain");
    const STAR_COUNT   = isDark ? 140 : 40;
    const starAlphaMax = isDark ? 0.7  : 0.2;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.2 + 0.2,
      alpha: Math.random() * starAlphaMax + 0.05,
      speed: Math.random() * 0.012 + 0.004,
      phase: Math.random() * Math.PI * 2,
    }));

    const orbs = [
      { x: W * 0.15, y: H * 0.25, r: 280, color: palette[0], speed: 0.0004, phase: 0 },
      { x: W * 0.82, y: H * 0.18, r: 220, color: palette[1], speed: 0.0006, phase: 2 },
      { x: W * 0.55, y: H * 0.78, r: 180, color: palette[2], speed: 0.0005, phase: 4 },
    ];

    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      orbs.forEach(o => {
        const ox = o.x + Math.sin(t * o.speed + o.phase) * 50;
        const oy = o.y + Math.cos(t * o.speed * 0.7 + o.phase) * 35;
        const g  = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0,   `rgba(${o.color},0.14)`);
        g.addColorStop(0.5, `rgba(${o.color},0.05)`);
        g.addColorStop(1,   `rgba(${o.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)";
      ctx.lineWidth = 1;
      const GRID = 72;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.15)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      t++;
      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      orbs[0].x = W * 0.15; orbs[0].y = H * 0.25;
      orbs[1].x = W * 0.82; orbs[1].y = H * 0.18;
      orbs[2].x = W * 0.55; orbs[2].y = H * 0.78;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [toneKey]);

  return <canvas ref={canvasRef} className="page-bg-canvas" />;
}

import React, { useRef, useEffect } from "react";
import ScrambleHover from "./ui/ScrambleHover";

// ─── Shimmer constants ────────────────────────────────────────────────────────
const OPACITY_DURATION_BASE      = 0.7;
const OPACITY_DURATION_VARIATION = 0.25;
const OPACITY_DELAY_CYCLE        = 1.5;
const OPACITY_DELAY_STEP         = 0.02;
const MIN_OPACITY_MULTIPLIER     = 0.3;
const MAX_OPACITY_MULTIPLIER     = 2.8;
const MIN_OPACITY_FALLBACK       = 0.08;
const PROXIMITY_MULTIPLIER       = 1.5;
const PROXIMITY_OPACITY_BOOST    = 1.6;
// ─────────────────────────────────────────────────────────────────────────────

const InteractiveDotGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let dots: Dot[] = [];
    const mouse = { x: -2000, y: -2000 };
    const MOUSE_R = 220;

    class Dot {
      x: number; y: number; baseX: number; baseY: number; size: number;
      baseOpacity: number; minOpacity: number; maxOpacity: number;
      currentOpacity: number; phaseOffset: number; duration: number;

      constructor(x: number, y: number, idx: number, ef: number, pat: number) {
        this.x = x; this.y = y; this.baseX = x; this.baseY = y; this.size = 1.15;
        const base       = [0.3, 0.5, 0.7][pat % 3] * Math.max(ef, 0.3);
        this.baseOpacity = base;
        this.minOpacity  = Math.max(base * MIN_OPACITY_MULTIPLIER, MIN_OPACITY_FALLBACK);
        this.maxOpacity  = Math.min(base * MAX_OPACITY_MULTIPLIER, 1);
        this.currentOpacity = this.minOpacity;
        this.phaseOffset = (idx * OPACITY_DELAY_STEP) % OPACITY_DELAY_CYCLE;
        this.duration    = OPACITY_DURATION_BASE + (idx % 4) * OPACITY_DURATION_VARIATION;
      }

      boost(): number {
        const d = Math.hypot(this.baseX - mouse.x, this.baseY - mouse.y);
        const maxD = MOUSE_R * PROXIMITY_MULTIPLIER;
        return d < maxD ? (1 - d / maxD) * PROXIMITY_OPACITY_BOOST : 0;
      }

      updateOpacity(t: number) {
        const lT   = (t - this.phaseOffset + this.duration * 100) % this.duration;
        const sine = Math.sin((lT / this.duration) * Math.PI);
        const b    = this.boost();
        const eff  = Math.min(this.minOpacity + b, 1);
        this.currentOpacity = Math.min(eff + sine * (this.maxOpacity - eff) + b * 0.08, 1);
      }

      update() {
        // Mouse — Manhattan / rhombus repulsion
        const mdx = mouse.x - this.baseX, mdy = mouse.y - this.baseY;
        const mM  = Math.abs(mdx) + Math.abs(mdy);
        if (mM < MOUSE_R) {
          const f = Math.pow((MOUSE_R - mM) / MOUSE_R, 2) * 120;
          const a = Math.atan2(mdy, mdx);
          const tx = this.baseX - Math.cos(a) * f;
          const ty = this.baseY - Math.sin(a) * f;
          this.x += (tx - this.x) * 0.15;
          this.y += (ty - this.y) * 0.15;
        } else {
          // Liquid return
          this.x += (this.baseX - this.x) * 0.04;
          this.y += (this.baseY - this.y) * 0.04;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(161,161,170,${this.currentOpacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      const el = canvas.parentElement;
      if (!el) return;
      const dpr = window.devicePixelRatio || 1;
      const W = el.clientWidth, H = el.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;

      dots = [];
      const sp = 28, cols = Math.floor(W / sp), rows = Math.floor(H / sp);
      const ox = (W - (cols - 1) * sp) / 2, oy = (H - (rows - 1) * sp) / 2;
      const cx = W / 2, cy = H / 2, maxD = Math.hypot(cx, cy);
      let idx = 0;
      for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++) {
          const x = ox + j * sp, y = oy + i * sp;
          const ef = 1 - Math.min(Math.hypot(x - cx, y - cy) / (maxD * 0.8), 1);
          dots.push(new Dot(x, y, idx++, ef, (i + j) % 3));
        }
    };

    const animate = (ts: number) => {
      if (!ctx || !canvas) return;
      const el = canvas.parentElement; if (!el) return;
      const W = el.clientWidth, H = el.clientHeight;
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) { d.update(); d.updateOpacity(ts / 1000); d.draw(); }
      animId = requestAnimationFrame(animate);
    };

    const onMove  = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -2000; mouse.y = -2000; };

    init();
    window.addEventListener("resize", init);
    canvas.parentElement?.addEventListener("mousemove", onMove);
    canvas.parentElement?.addEventListener("mouseleave", onLeave);
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const Footer = () => (
  <footer className="relative py-12 px-4 text-center border-t border-border/50 overflow-hidden bg-[#030303]">
    <InteractiveDotGrid />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
    <div className="relative z-10 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="h-px w-12 bg-indigo-500/50 mb-2" />
        <p className="text-sm text-foreground/80 font-semibold tracking-[0.2em] uppercase cursor-default">
          <ScrambleHover>SHIVAJI CHARAVARTHE M</ScrambleHover>
        </p>
        <div className="h-px w-12 bg-indigo-500/50 mt-2" />
      </div>
      <p className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.3em] font-medium">
        Transforming Data into Actionable Insights
      </p>
      <div className="pt-8">
        <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
          © {new Date().getFullYear()} · All rights reserved
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

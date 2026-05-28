"use client";
import { useEffect, useRef } from "react";

export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);
    let raf: number;
    let visible = true;

    const N = 24;
    const nodes = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * 6.28,
      hub: Math.random() < 0.2,
    }));

    let edges: number[][] = [];
    let pulses: { a: number; b: number; t: number; speed: number }[] = [];

    const buildEdges = () => {
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 160) edges.push([i, j]);
        }
      }
    };

    const spawn = () => {
      if (!edges.length) return;
      const e = edges[Math.floor(Math.random() * edges.length)];
      pulses.push({ a: e[0], b: e[1], t: 0, speed: 0.012 + Math.random() * 0.015 });
    };

    const pulseTimer = reduced ? null : setInterval(spawn, 400);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const draw = () => {
      if (!visible) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      buildEdges();

      edges.forEach(([i, j]) => {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        ctx.strokeStyle = `rgba(13,115,119,${(1 - d / 160) * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      pulses.forEach((p) => {
        const a = nodes[p.a], b = nodes[p.b];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(px, py, 0, px, py, 6);
        g.addColorStop(0, "rgba(45,200,150,0.9)");
        g.addColorStop(1, "rgba(45,200,150,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, 6.28);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, 6.28);
        ctx.fill();
        p.t += p.speed;
      });
      pulses = pulses.filter((p) => p.t < 1);

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const pr = n.r + Math.sin(n.pulse) * 0.8;
        if (n.hub) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr * 4);
          g.addColorStop(0, "rgba(13,115,119,0.4)");
          g.addColorStop(1, "rgba(13,115,119,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pr * 4, 0, 6.28);
          ctx.fill();
        }
        ctx.fillStyle = n.hub ? "rgba(13,115,119,0.95)" : "rgba(13,115,119,0.65)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, pr, 0, 6.28);
        ctx.fill();
      });

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    buildEdges();
    draw();
    if (!reduced) spawn();

    return () => {
      cancelAnimationFrame(raf);
      if (pulseTimer) clearInterval(pulseTimer);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

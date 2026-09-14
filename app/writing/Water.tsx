'use client';

import { useEffect, useRef } from 'react';

const COLUMNS = 72;
const LEVEL = 0.82;
const TILT = 0.06;
const SPRING = 0.012;
const DAMPING = 0.972;
const SPREAD = 0.1;
const PASSES = 4;

type Rgb = [number, number, number];

const SKY: Rgb = [170, 214, 236];
const WATER: Rgb = [104, 172, 216];
const DEEP: Rgb = [38, 92, 146];
const PAPER = '#fbfcfd';
const INK = 'rgba(20, 20, 20, 0.65)';

const rgba = (c: Rgb, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

type Kind = 'boat' | 'duck';
type Floater = {
  kind: Kind;
  x: number;
  home: number;
  vx: number;
  face: number;
};

export function Water() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const y = new Float32Array(COLUMNS);
    const v = new Float32Array(COLUMNS);
    const floaters: Floater[] = [
      { kind: 'boat', x: 0.42, home: 0.42, vx: 0, face: 1 },
      { kind: 'duck', x: 0.68, home: 0.68, vx: 0, face: -1 },
    ];
    const whale = { x: 0.5, phase: 0, next: 10 + Math.random() * 10 };
    let width = 0;
    let height = 0;
    let mouse = { x: 0.5, y: 0.5 };
    let tilt = 0;
    let lastX = -1;
    let frame = 0;
    let t = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (e: PointerEvent) => {
      mouse = { x: e.clientX / width, y: e.clientY / height };
      if (lastX >= 0) {
        const push = Math.min(Math.abs(e.clientX - lastX), 30) * 0.05;
        const center = mouse.x * (COLUMNS - 1);
        for (let i = 0; i < COLUMNS; i++) {
          const d = (i - center) / 3;
          v[i] -= push * Math.exp(-d * d);
        }
      }
      lastX = e.clientX;
    };

    const level = () => height * (LEVEL - 0.03 * mouse.y);

    const surfaceAt = (x: number) => {
      const f = x * (COLUMNS - 1);
      const lo = Math.max(0, Math.min(COLUMNS - 2, Math.floor(f)));
      const k = f - lo;
      const yy = y[lo] + (y[lo + 1] - y[lo]) * k;
      const slope = (y[lo + 1] - y[lo]) / (width / (COLUMNS - 1));
      return { y: level() + yy, angle: Math.atan(slope), slope };
    };

    const step = () => {
      t += 1 / 60;
      tilt += ((0.5 - mouse.x) * 2 - tilt) * 0.025;
      for (let i = 0; i < COLUMNS; i++) {
        const p = i / (COLUMNS - 1);
        const swell =
          Math.sin(t * 0.7 + p * 5) * 0.006 +
          Math.sin(t * 0.45 - p * 8) * 0.004;
        const rest = (tilt * TILT * (p - 0.5) * 2 + swell) * height;
        v[i] += (rest - y[i]) * SPRING;
        v[i] *= DAMPING;
        y[i] += v[i];
      }
      for (let pass = 0; pass < PASSES; pass++) {
        for (let i = 0; i < COLUMNS; i++) {
          const l = y[Math.max(0, i - 1)];
          const r = y[Math.min(COLUMNS - 1, i + 1)];
          v[i] += (l + r - 2 * y[i]) * SPREAD;
        }
      }
      floaters.forEach((f, idx) => {
        f.vx += surfaceAt(f.x).slope * 0.0006;
        f.vx += (f.home - f.x) * 0.00006;
        if (f.kind === 'duck') f.vx += Math.sin(t * 0.35 + idx) * 0.00002;
        for (const o of floaters) {
          if (o === f) continue;
          const d = f.x - o.x;
          if (Math.abs(d) < 0.07) f.vx += Math.sign(d || 1) * 0.00012;
        }
        f.vx *= 0.985;
        f.x += f.vx;
        if (f.x < 0.04 || f.x > 0.96) {
          f.x = Math.min(0.96, Math.max(0.04, f.x));
          f.vx *= -0.4;
        }
        if (Math.abs(f.vx) > 0.0004) f.face = f.vx > 0 ? 1 : -1;
      });
      if (whale.phase > 0) {
        whale.phase += 1 / 60 / 6;
        if (whale.phase >= 1) {
          whale.phase = 0;
          whale.next = t + 18 + Math.random() * 20;
        }
      } else if (t > whale.next) {
        whale.phase = 0.001;
        whale.x = 0.15 + Math.random() * 0.7;
      }
    };

    const trace = (offset: number, scale: number) => {
      const base = level() + offset;
      const px = (i: number) => (i / (COLUMNS - 1)) * width;
      const py = (i: number) => base + y[i] * scale;
      ctx.beginPath();
      ctx.moveTo(px(0), py(0));
      for (let i = 0; i < COLUMNS - 1; i++) {
        const mx = (px(i) + px(i + 1)) / 2;
        const my = (py(i) + py(i + 1)) / 2;
        ctx.quadraticCurveTo(px(i), py(i), mx, my);
      }
      ctx.lineTo(px(COLUMNS - 1), py(COLUMNS - 1));
    };

    const fill = (
      offset: number,
      scale: number,
      top: string,
      bottom: string,
    ) => {
      trace(offset, scale);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, height * LEVEL - 40, 0, height);
      g.addColorStop(0, top);
      g.addColorStop(1, bottom);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const drawWhale = () => {
      if (whale.phase <= 0) return;
      const rise = Math.sin(whale.phase * Math.PI);
      const s = surfaceAt(whale.x);
      ctx.save();
      ctx.translate(whale.x * width, s.y + 34 - rise * 44);
      ctx.fillStyle = rgba(DEEP, 0.95);
      ctx.beginPath();
      ctx.ellipse(0, 0, 44, 22, 0, Math.PI, 0);
      ctx.lineTo(44, 0);
      ctx.quadraticCurveTo(58, -4, 66, -18);
      ctx.quadraticCurveTo(60, -8, 62, 2);
      ctx.quadraticCurveTo(54, 10, 44, 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PAPER;
      ctx.beginPath();
      ctx.arc(-24, -8, 2, 0, Math.PI * 2);
      ctx.fill();
      if (rise > 0.75) {
        const spout = (rise - 0.75) * 4;
        ctx.fillStyle = rgba(SKY, 0.9);
        for (let i = 0; i < 3; i++) {
          const a = (i - 1) * 0.5;
          ctx.beginPath();
          ctx.arc(
            -16 + Math.sin(a) * 14 * spout,
            -26 - Math.cos(a) * 18 * spout,
            3.5 - i * 0.4,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawBoat = () => {
      ctx.fillStyle = PAPER;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-16, -1);
      ctx.lineTo(16, -1);
      ctx.lineTo(10, 7);
      ctx.lineTo(-10, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1, -1);
      ctx.lineTo(1, -20);
      ctx.lineTo(13, -1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(1, -1);
      ctx.lineTo(-9, -1);
      ctx.lineTo(1, -12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawDuck = () => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1;
      ctx.fillStyle = '#f7d774';
      ctx.beginPath();
      ctx.ellipse(0, -3, 11, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(7, -12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f0964a';
      ctx.beginPath();
      ctx.moveTo(12, -13);
      ctx.lineTo(19, -11);
      ctx.lineTo(12, -9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
      ctx.beginPath();
      ctx.arc(9, -14, 1.1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFloaters = () => {
      for (const f of floaters) {
        const s = surfaceAt(f.x);
        ctx.save();
        ctx.translate(f.x * width, s.y + 1);
        ctx.rotate(s.angle);
        ctx.scale(f.face * 1.4, 1.4);
        if (f.kind === 'boat') drawBoat();
        else drawDuck();
        ctx.restore();
      }
    };

    const draw = () => {
      step();
      ctx.clearRect(0, 0, width, height);
      drawWhale();
      fill(26, 0.7, rgba(SKY, 0.5), rgba(WATER, 0.55));
      fill(0, 1, rgba(WATER, 0.75), rgba(DEEP, 0.85));
      trace(0, 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
      drawFloaters();
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

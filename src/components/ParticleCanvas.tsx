'use client';

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { gsap } from 'gsap';
import { Particle, createParticle } from '../types/particle';
import Image from 'next/image';

const interval = 1000 / 60;
const PARTICLE_NUM = 800;

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [canvasSize, setCanvasSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);

  const countdownTextsRef = useRef<(HTMLSpanElement | null)[]>([
    null,
    null,
    null,
  ]);
  const ringImgRef = useRef<HTMLImageElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  const animationFrameRef = useRef<number | null>(null);
  const thenRef = useRef<number>(Date.now());

  const initCanvas = useCallback(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    setCanvasSize({ width, height });

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }, []);

  const createRing = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: PARTICLE_NUM }, () =>
      createParticle(canvasSize.width, canvasSize.height),
    );

    setParticles(newParticles);
  }, [canvasSize.width, canvasSize.height]);

  const render = useCallback(() => {
    if (!canvasRef.current || typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    particlesRef.current = particles;

    const renderFrame = () => {
      const now = Date.now();
      const delta = now - thenRef.current;

      if (delta < interval) {
        animationFrameRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      const currentParticles = particlesRef.current;
      const aliveParticles: Particle[] = [];

      // 모든 살아있는 파티클 업데이트 및 그리기
      for (let i = 0; i < currentParticles.length; i++) {
        const particle = currentParticles[i];
        if (particle.opacity <= 0.001) continue; // 작은 임계값으로 비교

        particle.update(canvasSize.width, canvasSize.height);
        particle.draw(ctx);
        aliveParticles.push(particle);
      }

      // 필요한 경우에만 상태 업데이트 (파티클 수가 변경된 경우)
      if (aliveParticles.length !== currentParticles.length) {
        setParticles(aliveParticles);
        particlesRef.current = aliveParticles;
      }

      thenRef.current = now - (delta % interval);
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animationFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasSize.width, canvasSize.height, particles]);

  const countDownOption = useMemo(
    () => ({
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'Power4.easeOut',
    }),
    [],
  );

  const startCountdown = useCallback(() => {
    if (isAnimationStarted || showComingSoon) return;

    setIsAnimationStarted(true);

    const countdownNumbers = countdownTextsRef.current;
    countdownNumbers?.forEach((element, index) => {
      if (!element) return;

      gsap.fromTo(
        element,
        { opacity: 0, scale: 5 },
        {
          ...countDownOption,
          delay: index,
          onStart: () => {
            if (index > 0 && countdownNumbers[index - 1]) {
              (countdownNumbers[index - 1] as HTMLSpanElement).style.opacity =
                '0';
            }
          },
          onComplete: () => {
            if (index === 2) {
              if (ringImgRef.current) {
                gsap.fromTo(
                  ringImgRef.current,
                  { opacity: 1 },
                  {
                    opacity: 0,
                    duration: 1,
                    onStart: () => {
                      if (element) element.style.opacity = '0';
                      createRing();
                      setShowComingSoon(true);
                    },
                  },
                );
              }
            }
          },
        },
      );
    });
  }, [countDownOption, createRing, isAnimationStarted, showComingSoon]);

  // Coming Soon 애니메이션
  useEffect(() => {
    if (showComingSoon && comingSoonRef.current) {
      gsap.fromTo(
        comingSoonRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'Power4.easeOut',
        },
      );
    }
  }, [showComingSoon]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (typeof window !== 'undefined') {
      initCanvas();
      render();

      const handleResize = () => {
        initCanvas();
      };

      window.addEventListener('resize', handleResize);

      if (!isAnimationStarted && !showComingSoon) {
        timer = setTimeout(() => {
          startCountdown();
        }, 1000);
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timer);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }

    return undefined;
  }, [initCanvas, render, startCountdown, isAnimationStarted, showComingSoon]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="w-[50vh] h-[50vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Image
          ref={ringImgRef}
          src="https://res.cloudinary.com/dzhgopctc/image/upload/v1749710924/circle_zaqud9.webp"
          alt="ring"
          fill
          className="object-contain"
          priority
        />
      </div>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
        style={{ width: '50vh', height: '50vh' }}
      >
        {[3, 2, 1].map((number, index) => (
          <span
            key={number}
            ref={(el) => {
              countdownTextsRef.current[index] = el;
            }}
            className="absolute text-7xl scale-[5] opacity-0 text-center"
          >
            {number}
          </span>
        ))}
      </div>
      {showComingSoon && (
        <div
          ref={comingSoonRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0"
        >
          <h1 className="text-white text-5xl font-bold">Coming Soon</h1>
        </div>
      )}
    </div>
  );
};

export default ParticleCanvas;

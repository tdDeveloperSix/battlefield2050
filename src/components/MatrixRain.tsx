import React, { useEffect, useRef } from 'react';

interface Column {
  x: number; // px
  y: number; // px (head position)
  speed: number; // px/sec
  tail: number; // antal tegn i halen
}

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    const setSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setSize();

    const fontSize = 16; // px i CSS-pixels
    const baseSpeedPxPerSec = 60; // lavere hastighed for mindre distraktion

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let columns: Column[] = [];

    const initColumns = () => {
      const numCols = Math.ceil(window.innerWidth / fontSize);
      columns = new Array(numCols).fill(0).map((_, i) => ({
        x: i * fontSize,
        y: Math.random() * window.innerHeight,
        speed: baseSpeedPxPerSec * (0.75 + Math.random() * 0.6), // 75% - 135%
        tail: Math.floor(10 + Math.random() * 18), // 10 - 28 tegn i halen
      }));
      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    initColumns();

    let lastTime = performance.now();

    const draw = () => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000; // sekunder
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = 0; i < columns.length; i += 1) {
        const col = columns[i];

        for (let j = 0; j < col.tail; j += 1) {
          const yPos = Math.floor(col.y - j * fontSize);
          if (yPos < -fontSize || yPos > window.innerHeight) continue;

          const ch = chars.charAt(Math.floor(Math.random() * chars.length));

          if (j === 0) {
            ctx.fillStyle = '#CFFFE0';
            ctx.globalAlpha = 1;
          } else {
            const alpha = Math.max(0.08, 1 - j / col.tail);
            ctx.fillStyle = '#00FF66';
            ctx.globalAlpha = alpha * 0.9;
          }

          ctx.fillText(ch, col.x, yPos);
        }

        col.y += col.speed * dt;

        if (col.y - col.tail * fontSize > window.innerHeight) {
          col.y = -Math.random() * 200;
          col.speed = baseSpeedPxPerSec * (0.75 + Math.random() * 0.6);
          col.tail = Math.floor(10 + Math.random() * 18);
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(draw);
    }

    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.setTimeout(() => {
        setSize();
        initColumns();
        lastTime = performance.now();
        if (!prefersReducedMotion && !animationRef.current) {
          animationRef.current = requestAnimationFrame(draw);
        }
      }, 250) as unknown as number;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-20 pointer-events-none"
      aria-hidden
    />
  );
};

export default MatrixRain; 

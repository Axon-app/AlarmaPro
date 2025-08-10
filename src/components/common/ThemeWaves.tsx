import React, { useRef, useEffect } from 'react';
import { THEME_WAVES, THEME_ACCENT_HEX } from '../../constants';
import type { ThemeType } from '../../types';

interface ThemeWavesProps {
  theme: ThemeType;
  isDarkMode?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export const ThemeWaves: React.FC<ThemeWavesProps> = ({
  theme,
  isDarkMode = true,
  width = 360,
  height = 80,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const config = THEME_WAVES[theme];
    const accent = THEME_ACCENT_HEX[theme];

    let raf = 0;
    const t0 = performance.now();

    const drawRibbons = (time: number) => {
      const t = (time - t0) * 0.0015;
      ctx.clearRect(0, 0, width, height);
      config.colors.forEach((color, i) => {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.globalAlpha = isDarkMode ? 0.8 : 0.6;
        for (let x = 0; x <= width; x++) {
          const y = height/2 + Math.sin((x * 0.02) + (t * (0.8 + i*0.2))) * (10 + i*3);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
    };

    const drawBars = (time: number) => {
      const t = (time - t0) * 0.002;
      ctx.clearRect(0, 0, width, height);
      const barCount = 40;
      const barW = width / barCount;
      for (let i = 0; i < barCount; i++) {
        const amp = (Math.sin(i * 0.5 + t * 2) + 1) / 2;
        const h = 10 + amp * (height - 20);
        const color = config.colors[i % config.colors.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = isDarkMode ? 0.8 : 0.7;
        ctx.fillRect(i * barW + 1, (height - h) / 2, barW - 2, h);
      }
    };

    const drawDots = (time: number) => {
      const t = (time - t0) * 0.0018;
      ctx.clearRect(0, 0, width, height);
      const rows = 3;
      const cols = 40;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * (width / cols);
          const baseY = (r + 1) * (height / (rows + 1));
          const y = baseY + Math.sin(c * 0.4 + t * (1 + r*0.3)) * 8;
          ctx.beginPath();
          ctx.fillStyle = config.colors[(r + c) % config.colors.length];
          ctx.globalAlpha = isDarkMode ? 0.85 : 0.75;
          ctx.arc(x, y, 2.2 + r*0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawBezier = (time: number) => {
      const t = (time - t0) * 0.0012;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = config.colors[i % config.colors.length];
        ctx.globalAlpha = isDarkMode ? 0.8 : 0.6;
        ctx.moveTo(0, height/2);
        const cp1y = height/2 + Math.sin(t * (1.2 + i*0.3)) * 18;
        const cp2y = height/2 + Math.cos(t * (1.0 + i*0.2)) * 18;
        ctx.bezierCurveTo(width*0.33, cp1y, width*0.66, cp2y, width, height/2);
        ctx.stroke();
      }
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, accent + '00');
      grd.addColorStop(0.5, accent + '22');
      grd.addColorStop(1, accent + '00');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);
    };

    const loop = (time: number) => {
      switch (config.variant) {
        case 'bars':
          drawBars(time); break;
        case 'dots':
          drawDots(time); break;
        case 'bezier':
          drawBezier(time); break;
        default:
          drawRibbons(time); break;
      }
      raf = requestAnimationFrame(loop);
    };
    loop(performance.now());
    return () => cancelAnimationFrame(raf);
  }, [theme, isDarkMode, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-xl opacity-80 ${className}`}
      style={{ width, height }}
    />
  );
};

export default ThemeWaves;

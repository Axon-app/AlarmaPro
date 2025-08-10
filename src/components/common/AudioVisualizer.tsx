import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  className?: string;
  width?: number;
  height?: number;
  waveCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  className = '',
  width = 300,
  height = 60,
  waveCount = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;
    
    let animationId: number;
    const waves: Array<{
      amplitude: number;
      frequency: number;
      phase: number;
      color: string;
    }> = [];
    
    // Initialize waves
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        amplitude: Math.random() * 20 + 10,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: `hsl(${280 + i * 20}, 70%, 60%)`
      });
    }
    
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * wave.frequency + time * 0.01 + wave.phase) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [width, height, waveCount]);

  return (
    <canvas 
      ref={canvasRef}
      className={`rounded-xl opacity-70 ${className}`}
      style={{ width, height }}
    />
  );
};

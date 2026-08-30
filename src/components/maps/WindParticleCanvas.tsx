import { useEffect, useRef } from "react";

interface WindParticleCanvasProps {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  enabled?: boolean;
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  angle: number;
  radius: number;
  life: number;
  maxLife: number;
  opacity: number;
}

export function WindParticleCanvas({
  width,
  height,
  centerX,
  centerY,
  enabled = true,
}: WindParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particleCount = 140;
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      // Spawn around the storm within 40 to 320 px
      const r = 40 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      return {
        x: centerX + Math.cos(theta) * r,
        y: centerY + Math.sin(theta) * r,
        radius: r,
        angle: theta,
        speed: 0.012 + Math.random() * 0.018,
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 60,
        opacity: 0.15 + Math.random() * 0.45,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Spiral inward toward center (counter-clockwise cyclonic)
        p.angle -= p.speed * (180 / Math.max(40, p.radius));
        p.radius -= 0.65;
        p.life += 1;

        if (p.radius < 18 || p.life > p.maxLife) {
          const fresh = createParticle();
          p.radius = fresh.radius;
          p.angle = fresh.angle;
          p.life = 0;
          p.maxLife = fresh.maxLife;
        }

        const prevX = p.x;
        const prevY = p.y;
        p.x = centerX + Math.cos(p.angle) * p.radius;
        p.y = centerY + Math.sin(p.angle) * p.radius;

        // Draw curved streamline segment
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(115, 209, 255, ${p.opacity * (p.radius / 260)})`;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width, height, centerX, centerY, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

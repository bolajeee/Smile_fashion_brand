import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  decay: number;
}

const ButterflyScanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const butterflyPointsRef = useRef<{ x: number; y: number }[]>([]);
  const requestRef = useRef<number>();

  // Generate butterfly curve points
  const generateButterflyPoints = (canvas: HTMLCanvasElement) => {
    const points: { x: number; y: number }[] = [];
    for (let t = 0; t < Math.PI * 24; t += 0.05) {
      const k =
        Math.E ** Math.cos(t) -
        2 * Math.cos(4 * t) -
        Math.sin(t / 12) ** 5;
      const x = Math.sin(t) * k;
      const y = Math.cos(t) * k;
      points.push({
        x: canvas.width / 2 + x * 50, // scale + center
        y: canvas.height / 2 - y * 50,
      });
    }
    return points;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      butterflyPointsRef.current = generateButterflyPoints(canvas);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles (all locked to butterfly curve)
    const initParticles = () => {
      const particles: Particle[] = [];
      const count = 1500; // more particles = sharper, clearer outline
      const points = butterflyPointsRef.current;

      for (let i = 0; i < count; i++) {
        const point = points[Math.floor(Math.random() * points.length)];
        particles.push({
          x: point.x,
          y: point.y,
          radius: Math.random() * 2.2 + 0.8, // larger dots
          alpha: Math.random() * 0.3 + 0.7, // higher minimum alpha for visibility
          decay: 0.002 + Math.random() * 0.006, // slower fade for clarity
        });
      }

      particlesRef.current = particles;
    };

    // Animate crisp outline
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Fade particle
        particle.alpha -= particle.decay;

        // Respawn faded particle at a new outline point
        if (particle.alpha <= 0) {
          const point =
            butterflyPointsRef.current[
              Math.floor(Math.random() * butterflyPointsRef.current.length)
            ];
          particle.x = point.x;
          particle.y = point.y;
          particle.alpha = Math.random() * 0.5 + 0.5;
        }

        // Draw particle (no glow, crisp dot)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--color-brand-primary-rgb), ${particle.alpha})`;
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      className="scanner-container absolute inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block", width: "100vw", height: "100vh" }}
      />
    </div>
  );
};

export default ButterflyScanner;

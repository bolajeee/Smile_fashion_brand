import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
}

const FeatureScanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const count = 100;
      const centerX = canvas.width / 2;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: centerX + (Math.random() - 0.5) * 20,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.5,
          decay: 0.01 + Math.random() * 0.01,
        });
      }

      particlesRef.current = particles;
    };

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Attraction to center line
        const dx = centerX - particle.x;
        particle.vx += dx * 0.005;

        // Add some random movement
        particle.vx += (Math.random() - 0.5) * 0.1;
        particle.vy += (Math.random() - 0.5) * 0.1;

        // Decay
        particle.alpha -= particle.decay;

        // Reset particle if it's faded out or too far from center
        if (particle.alpha <= 0 || Math.abs(dx) > 100) {
          particle.x = centerX + (Math.random() - 0.5) * 20;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 2;
          particle.vy = (Math.random() - 0.5) * 2;
          particle.alpha = Math.random() * 0.5 + 0.5;
        }

        // Draw particle
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
      window.removeEventListener('resize', resize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="scanner-container">
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="scanner-line" />
    </div>
  );
};

export default FeatureScanner;

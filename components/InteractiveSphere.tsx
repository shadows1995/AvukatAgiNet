import React, { useEffect, useRef } from 'react';

interface InteractiveSphereProps {
    dotColor?: string;
    lineColor?: string;
}

const InteractiveSphere: React.FC<InteractiveSphereProps> = ({
    dotColor = '#4299e1', // Blue-400
    lineColor = '#6366f1' // Indigo-500
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Helper to convert hex to rgb
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 66, g: 153, b: 225 };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        // Configuration
        const particleCount = 250; // Adjusted for performance with lines
        const connectionDistance = 100; // Max distance to draw a line
        const baseRadius = Math.min(width, height) / 2.8;

        let rotationX = 0;
        let rotationY = 0;

        const dotRgb = hexToRgb(dotColor);
        const lineRgb = hexToRgb(lineColor);

        interface Point3D {
            x: number;
            y: number;
            z: number;
        }

        class Particle {
            x: number;
            y: number;
            z: number;
            baseX: number;
            baseY: number;
            baseZ: number;
            size: number;

            constructor() {
                // Distribute points evenly on a sphere using Fibonacci sphere algorithm
                // This gives a much better "network" look than random distribution
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.baseX = 0;
                this.baseY = 0;
                this.baseZ = 0;
                this.size = 1.5;
            }

            setPosition(i: number, total: number, radius: number) {
                const phi = Math.acos(1 - 2 * (i + 0.5) / total);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

                this.baseX = radius * Math.cos(theta) * Math.sin(phi);
                this.baseY = radius * Math.sin(theta) * Math.sin(phi);
                this.baseZ = radius * Math.cos(phi);

                this.x = this.baseX;
                this.y = this.baseY;
                this.z = this.baseZ;
            }

            rotate(rotX: number, rotY: number) {
                // Rotate around Y axis
                let y = this.baseY;
                let z = this.baseZ;
                let x = this.baseX;

                let cos = Math.cos(rotY);
                let sin = Math.sin(rotY);

                let x2 = x * cos - z * sin;
                let z2 = z * cos + x * sin;

                // Rotate around X axis
                cos = Math.cos(rotX);
                sin = Math.sin(rotX);

                let y2 = y * cos - z2 * sin;
                let z3 = z2 * cos + y * sin;

                this.x = x2;
                this.y = y2;
                this.z = z3;
            }
        }

        // Initialize particles
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            const p = new Particle();
            p.setPosition(i, particleCount, baseRadius);
            particles.push(p);
        }

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Constant smooth rotation
            rotationY += 0.003;
            rotationX += 0.0015;

            const centerX = width / 2;
            const centerY = height / 2;

            // Update positions
            particles.forEach(p => p.rotate(rotationX, rotationY));

            // Sort particles by Z depth for correct drawing order (back to front)
            particles.sort((a, b) => a.z - b.z);

            // Draw connections and particles
            particles.forEach((p, i) => {
                // Perspective projection
                const scale = 400 / (400 + p.z);
                const x2d = p.x * scale + centerX;
                const y2d = p.y * scale + centerY;
                const alpha = Math.max(0.1, (p.z + baseRadius) / (2 * baseRadius)); // Fade back particles

                // Draw connections
                // Only connect to particles that come AFTER this one in the sorted list
                // This prevents double drawing and saves performance
                // Also limit to a subset to avoid O(n^2) on every frame if count is high
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dz = p.z - p2.z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < connectionDistance) {
                        const scale2 = 400 / (400 + p2.z);
                        const x2d2 = p2.x * scale2 + centerX;
                        const y2d2 = p2.y * scale2 + centerY;

                        // Line opacity based on distance and depth
                        const lineAlpha = (1 - dist / connectionDistance) * alpha * 0.5;

                        ctx.beginPath();
                        ctx.moveTo(x2d, y2d);
                        ctx.lineTo(x2d2, y2d2);
                        ctx.strokeStyle = `rgba(${lineRgb.r}, ${lineRgb.g}, ${lineRgb.b}, ${lineAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }

                // Draw particle
                ctx.fillStyle = `rgba(${dotRgb.r}, ${dotRgb.g}, ${dotRgb.b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dotColor, lineColor]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full absolute top-0 left-0 pointer-events-none"
        />
    );
};

export default InteractiveSphere;

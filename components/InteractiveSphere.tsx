import React, { useEffect, useRef } from 'react';

const InteractiveSphere: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const particles: Particle[] = [];
        const particleCount = 600;
        const radius = Math.min(width, height) / 3;

        let mouseX = 0;
        let mouseY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;
        let rotationX = 0;
        let rotationY = 0;

        class Particle {
            x: number;
            y: number;
            z: number;
            baseX: number;
            baseY: number;
            baseZ: number;
            size: number;

            constructor() {
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos((Math.random() * 2) - 1);

                this.baseX = radius * Math.sin(phi) * Math.cos(theta);
                this.baseY = radius * Math.sin(phi) * Math.sin(theta);
                this.baseZ = radius * Math.cos(phi);

                this.x = this.baseX;
                this.y = this.baseY;
                this.z = this.baseZ;
                this.size = 1.5;
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

            draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
                // Perspective projection
                const scale = 400 / (400 + this.z);
                const x2d = this.x * scale + centerX;
                const y2d = this.y * scale + centerY;

                // Fade out particles at the back
                const alpha = Math.max(0.1, (this.z + radius) / (2 * radius));

                ctx.fillStyle = `rgba(66, 153, 225, ${alpha})`; // Blue-400 color
                ctx.beginPath();
                ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth rotation
            rotationX += (targetRotationX - rotationX) * 0.05;
            rotationY += (targetRotationY - rotationY) * 0.05;

            // Auto rotation if no mouse interaction
            if (Math.abs(targetRotationX) < 0.01 && Math.abs(targetRotationY) < 0.01) {
                rotationY += 0.002;
            }

            const centerX = width / 2;
            const centerY = height / 2;

            particles.forEach(p => {
                p.rotate(rotationX, rotationY);
                p.draw(ctx, centerX, centerY);
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left - width / 2;
            mouseY = e.clientY - rect.top - height / 2;

            targetRotationY = mouseX * 0.001;
            targetRotationX = -mouseY * 0.001;
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', () => {
            targetRotationX = 0;
            targetRotationY = 0;
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full absolute top-0 left-0 pointer-events-auto"
            style={{ touchAction: 'none' }}
        />
    );
};

export default InteractiveSphere;

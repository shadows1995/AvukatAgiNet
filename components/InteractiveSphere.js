"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InteractiveSphere = function (_a) {
    var _b = _a.dotColor, dotColor = _b === void 0 ? '#4299e1' : _b, // Blue-400
    _c = _a.lineColor // Indigo-500
    , // Blue-400
    lineColor = _c === void 0 ? '#6366f1' : _c // Indigo-500
    ;
    var canvasRef = (0, react_1.useRef)(null);
    // Helper to convert hex to rgb
    var hexToRgb = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 66, g: 153, b: 225 };
    };
    (0, react_1.useEffect)(function () {
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var width = canvas.width = canvas.offsetWidth;
        var height = canvas.height = canvas.offsetHeight;
        // Configuration
        var particleCount = 250; // Adjusted for performance with lines
        var connectionDistance = 100; // Max distance to draw a line
        var baseRadius = Math.min(width, height) / 2.8;
        var rotationX = 0;
        var rotationY = 0;
        var dotRgb = hexToRgb(dotColor);
        var lineRgb = hexToRgb(lineColor);
        var Particle = /** @class */ (function () {
            function Particle() {
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
            Particle.prototype.setPosition = function (i, total, radius) {
                var phi = Math.acos(1 - 2 * (i + 0.5) / total);
                var theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
                this.baseX = radius * Math.cos(theta) * Math.sin(phi);
                this.baseY = radius * Math.sin(theta) * Math.sin(phi);
                this.baseZ = radius * Math.cos(phi);
                this.x = this.baseX;
                this.y = this.baseY;
                this.z = this.baseZ;
            };
            Particle.prototype.rotate = function (rotX, rotY) {
                // Rotate around Y axis
                var y = this.baseY;
                var z = this.baseZ;
                var x = this.baseX;
                var cos = Math.cos(rotY);
                var sin = Math.sin(rotY);
                var x2 = x * cos - z * sin;
                var z2 = z * cos + x * sin;
                // Rotate around X axis
                cos = Math.cos(rotX);
                sin = Math.sin(rotX);
                var y2 = y * cos - z2 * sin;
                var z3 = z2 * cos + y * sin;
                this.x = x2;
                this.y = y2;
                this.z = z3;
            };
            return Particle;
        }());
        // Initialize particles
        var particles = [];
        for (var i = 0; i < particleCount; i++) {
            var p = new Particle();
            p.setPosition(i, particleCount, baseRadius);
            particles.push(p);
        }
        var animationFrameId;
        var animate = function () {
            ctx.clearRect(0, 0, width, height);
            // Constant smooth rotation
            rotationY += 0.003;
            rotationX += 0.0015;
            var centerX = width / 2;
            var centerY = height / 2;
            // Update positions
            particles.forEach(function (p) { return p.rotate(rotationX, rotationY); });
            // Sort particles by Z depth for correct drawing order (back to front)
            particles.sort(function (a, b) { return a.z - b.z; });
            // Draw connections and particles
            particles.forEach(function (p, i) {
                // Perspective projection
                var scale = 400 / (400 + p.z);
                var x2d = p.x * scale + centerX;
                var y2d = p.y * scale + centerY;
                var alpha = Math.max(0.1, (p.z + baseRadius) / (2 * baseRadius)); // Fade back particles
                // Draw connections
                // Only connect to particles that come AFTER this one in the sorted list
                // This prevents double drawing and saves performance
                // Also limit to a subset to avoid O(n^2) on every frame if count is high
                for (var j = i + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var dx = p.x - p2.x;
                    var dy = p.y - p2.y;
                    var dz = p.z - p2.z;
                    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < connectionDistance) {
                        var scale2 = 400 / (400 + p2.z);
                        var x2d2 = p2.x * scale2 + centerX;
                        var y2d2 = p2.y * scale2 + centerY;
                        // Line opacity based on distance and depth
                        var lineAlpha = (1 - dist / connectionDistance) * alpha * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x2d, y2d);
                        ctx.lineTo(x2d2, y2d2);
                        ctx.strokeStyle = "rgba(".concat(lineRgb.r, ", ").concat(lineRgb.g, ", ").concat(lineRgb.b, ", ").concat(lineAlpha, ")");
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                // Draw particle
                ctx.fillStyle = "rgba(".concat(dotRgb.r, ", ").concat(dotRgb.g, ", ").concat(dotRgb.b, ", ").concat(alpha, ")");
                ctx.beginPath();
                ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        var handleResize = function () {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', handleResize);
        return function () {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [dotColor, lineColor]);
    return (<canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0 pointer-events-none"/>);
};
exports.default = InteractiveSphere;

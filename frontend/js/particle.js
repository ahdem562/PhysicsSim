class Particle {
    constructor(x, y, radius) {
        // Kinematics vectors
        this.pos = new Vector2D(x, y);
        this.vel = new Vector2D(0, 0); // Start at rest
        this.acc = new Vector2D(0, 0); // No initial force

        // Prperties
        this.radius = radius;
        this.mass = 1; // Default mass
        // How much energy is retained per bounce
        this.bounciness = 0.8;

        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    // Apply force to particle (F = ma, a = F/m)
    applyForce(force) {
        let f = new Vector2D(force.x, force.y);
        f.mult(1 / this.mass); // a = F/m
        this.acc.add(f);
    }

    // Update particle based on vel and acc
    update() {
        this.vel.add(this.acc);
        this.vel.limit(15); // Limit max speed
        this.vel.mult(0.99); // Apply drag friction
        this.pos.add(this.vel);

        // Reset acc for next frame
        this.acc.mult(0);
    }

    checkEdges(canvas) {
        // Check for floor collision
        if(this.pos.y + this.radius >= canvas.height) {
            // Prevent sinking
            this.pos.y = canvas.height - this.radius;
            
            // Threshold for bouncing vs stopping
            if(this.vel.y > 1) {
                this.vel.y *= -this.bounciness;
            } else {
                this.vel.y = 0; // Stops micro bounce
            }

            // Multiply x vel by num less than 1
            this.vel.x *= 0.98;
        }

        // Right edge
        if(this.pos.x + this.radius >= canvas.width) {
            this.pos.x = canvas.width - this.radius;
            this.vel.x *= -this.bounciness;
        }

        // Left edge
        if(this.pos.x - this.radius <= 0) {
            this.pos.x = this.radius;
            this.vel.x *= -this.bounciness;
        }
    }

    // Display particle
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Neon Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }

}

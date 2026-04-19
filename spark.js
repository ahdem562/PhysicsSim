class Spark {
    constructor(x, y) {
        this.pos = new Vector2D(x, y);
        this.vel = new Vector2D((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15);
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
        this.color = `hsl(${Math.random() * 60 + 10}, 100%, 50%)`;
    }

    update() {
        this.pos.add(this.vel);
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1.0;
    }

}
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
    }

    // Calc mag (length) of vector
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Limit magnitude of vector speed
    limit(max) {
        const mSq = this.x * this.x + this.y * this.y;
        if(mSq > max * max) {
            const m = Math.sqrt(mSq);
            this.x = (this.x / m) * max;
            this.y = (this.y / m) * max;
        }
    }
}

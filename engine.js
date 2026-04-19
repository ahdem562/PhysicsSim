const canvas = document.getElementById('physicsCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particles = [];
let sparks = [];

let gravity = new Vector2D(0, 0.5);

window.engineDrag = 0.99; 
let globalBounciness = 0.8;
let globalRepulsion = 0;

const MAX_PARTICLES = 25;

// Mouse Tracking
let mouseX = -1000;
let mouseY = -1000;
let isMouseDown = false;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});
canvas.addEventListener('mousedown', () => isMouseDown = true);
canvas.addEventListener('mouseup', () => isMouseDown = false);
canvas.addEventListener('mouseleave', () => isMouseDown = false);

canvas.addEventListener('click', (e) => {
    let randomRadius = Math.random() * 20 + 10;
    let newParticle = new Particle(e.offsetX, e.offsetY, randomRadius);
    
    newParticle.vel.x = (Math.random() - 0.5) * 10;
    newParticle.vel.y = (Math.random() - 0.5) * 10;
    newParticle.bounciness = globalBounciness;

    particles.push(newParticle);

    if(particles.length > MAX_PARTICLES) {
        particles.shift();
    }
});

function resolveCollision(p1, p2) {
    const dx = p2.pos.x - p1.pos.x;
    const dy = p2.pos.y - p1.pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Electrostatic Repulsion
    if (globalRepulsion > 0 && distance > 0 && distance < 200) {
        const force = globalRepulsion / (distance * 0.1); 
        const angle = Math.atan2(dy, dx);
        
        const pushX = Math.cos(angle) * force;
        const pushY = Math.sin(angle) * force;
        
        p1.vel.x -= pushX;
        p1.vel.y -= pushY;
        p2.vel.x += pushX;
        p2.vel.y += pushY;
    }

    const minDistance = p1.radius + p2.radius;

    if(distance < minDistance) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;
        
        const pushX = Math.cos(angle) * overlap / 2;
        const pushY = Math.sin(angle) * overlap / 2;
        p1.pos.x -= pushX;
        p1.pos.y -= pushY;
        p2.pos.x += pushX;
        p2.pos.y += pushY;

        const normalX = dx / distance;
        const normalY = dy / distance;

        const relVelX = p1.vel.x - p2.vel.x;
        const relVelY = p1.vel.y - p2.vel.y;
        const speed = relVelX * normalX + relVelY * normalY;

        if(speed < 0.5) return; 

        const impulse = (1 + globalBounciness) * speed / 2;
        p1.vel.x -= impulse * normalX;
        p1.vel.y -= impulse * normalY;
        p2.vel.x += impulse * normalX;
        p2.vel.y += impulse * normalY;

        const impactX = p1.pos.x + (dx / 2);
        const impactY = p1.pos.y + (dy / 2);
        for(let k = 0; k < 5; k++) {
            sparks.push(new Spark(impactX, impactY));
        }
    }
}

function update() {
    // Motion Trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Forcefield
    if (isMouseDown) {
        for(let i = 0; i < particles.length; i++) {
            let p = particles[i];
            let dx = p.pos.x - mouseX;
            let dy = p.pos.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) { 
                let forceMag = (150 - distance) / 150;
                let angle = Math.atan2(dy, dx);
                
                p.vel.x += Math.cos(angle) * forceMag * 2;
                p.vel.y += Math.sin(angle) * forceMag * 2;
            }
        }
    }

    for(let i = 0; i < particles.length; i++) {
        particles[i].applyForce(gravity);
        particles[i].update();
    }

    for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
            resolveCollision(particles[i], particles[j]);
        }
    }

    for(let i = 0; i < particles.length; i++) {
        particles[i].checkEdges(canvas);
        particles[i].draw(ctx);
    }

    for(let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        if(sparks[i].life <= 0) {
            sparks.splice(i, 1);
        } else {
            sparks[i].draw(ctx);
        }
    }

    requestAnimationFrame(update);
}

update();

// UI/API Bridge
window.engine = {
    setGravity: function(value) {
        gravity.y = value;
    },
    setBounce: function(value) {
        globalBounciness = value;
        particles.forEach(p => p.bounciness = value);
    },
    toggleAirResistance: function(enabled) {
        window.engineDrag = enabled ? 0.99 : 1.0; 
    },
    setRepulsion: function(value) {
        globalRepulsion = value;
    },
    clearAll: function() {
        particles = [];
        sparks = [];
    },
    getState: function() {
        return particles.map(p => ({
            x: p.pos.x,
            y: p.pos.y,
            vx: p.vel.x,
            vy: p.vel.y,
            radius: p.radius,
            color: p.color
        }));
    },
    loadState: function(stateData) {
        particles = [];
        stateData.forEach(data => {
            let p = new Particle(data.x, data.y, data.radius);
            p.vel = new Vector2D(data.vx, data.vy);
            p.color = data.color;
            p.bounciness = globalBounciness;
            particles.push(p);
        });
    }
};
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddle = { x: canvas.width / 2 - 40, y: canvas.height - 20, width: 80, height: 10, speed: 5 };
const ball = { x: canvas.width / 2, y: canvas.height - 40, radius: 8, speedX: 3, speedY: -3 };
let bricks = [];
let score = 0;
let gameOver = false;

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function createBricks() {
    bricks = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            bricks.push({
                x: col * 90 + 10,
                y: row * 30 + 10,
                width: 80,
                height: 20,
                active: true
            });
        }
    }
}

function update() {
    if (gameOver) return;
    
    // Move paddle
    if (keys['ArrowLeft'] && paddle.x > 0) {
        paddle.x -= paddle.speed;
    }
    if (keys['ArrowRight'] && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.speed;
    }
    
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.speedY *= -1;
    }
    
    // Ball collision with paddle
    if (ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        ball.speedY *= -1;
    }
    
    // Ball collision with bricks
    bricks.forEach(brick => {
        if (!brick.active) return;
        
        if (ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height) {
            // BUG: Should deactivate brick, but doesn't
            // brick.active = false;
            score++;
            ball.speedY *= -1;
        }
    });
    
    // Game over if ball falls
    if (ball.y > canvas.height) {
        gameOver = true;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddle
    ctx.fillStyle = '#0f0';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Draw ball
    ctx.fillStyle = '#f0f';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bricks
    bricks.forEach(brick => {
        if (brick.active) {
            ctx.fillStyle = '#0ff';
            ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
    });
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
    
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

createBricks();
gameLoop();

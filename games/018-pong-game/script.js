const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddle = { width: 10, height: 80, speed: 6 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 3, speedY: 3 };

let player1 = { x: 20, y: canvas.height / 2 - paddle.height / 2, ...paddle };
let player2 = { x: canvas.width - 30, y: canvas.height / 2 - paddle.height / 2, ...paddle };

let score1 = 0, score2 = 0;
let keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

function update() {
    // Player 1 controls (W/S)
    if (keysPressed['w'] && player1.y > 0) {
        player1.y -= player1.speed;
    }
    if (keysPressed['s'] && player1.y < canvas.height - player1.height) {
        player1.y += player1.speed;
    }
    
    // Player 2 controls (ArrowUp/ArrowDown)
    if (keysPressed['ArrowUp'] && player2.y > 0) {
        player2.y -= player2.speed;
    }
    if (keysPressed['ArrowDown'] && player2.y < canvas.height - player2.height) {
        player2.y += player2.speed;
    }
    
    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Ball collision with top/bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY *= -1;
    }
    
    // Ball collision with paddles
    // BUG: The collision detection uses wrong comparison
    if (ball.x - ball.radius < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height) {
        if (ball.speedX > 0) {  // Wrong condition!
            ball.speedX *= -1;
        }
    }
    
    if (ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height) {
        if (ball.speedX > 0) {  // Wrong condition!
            ball.speedX *= -1;
        }
    }
    
    // Ball out of bounds
    if (ball.x < 0) {
        score2++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
    if (ball.x > canvas.width) {
        score1++;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw scores
    ctx.font = '30px Arial';
    ctx.fillText(score1, canvas.width / 4, 50);
    ctx.fillText(score2, (canvas.width * 3) / 4, 50);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

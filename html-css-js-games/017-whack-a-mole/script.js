let score = 0;
let timeLeft = 30;
let gameActive = false;
let currentMole = null;

const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('startBtn');
const messageDisplay = document.getElementById('message');
const holes = document.querySelectorAll('.hole');

function startGame() {
    score = 0;
    timeLeft = 30;
    gameActive = true;
    startBtn.disabled = true;
    scoreDisplay.textContent = 0;
    messageDisplay.textContent = '';
    
    spawnMole();
    
    const timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            messageDisplay.textContent = `Game Over! Final Score: ${score}`;
            startBtn.disabled = false;
            currentMole?.classList.remove('mole');
        }
    }, 1000);
}

function spawnMole() {
    if (!gameActive) return;
    
    // Remove old mole
    if (currentMole) {
        currentMole.classList.remove('mole');
        // BUG: Should reset to 🕳️ but doesn't
        // currentMole.textContent = '🕳️';
    }
    
    // Pick random hole
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    currentMole = randomHole;
    currentMole.textContent = '🐹';
    currentMole.classList.add('mole');
    
    // Mole disappears after 1 second if not whacked
    setTimeout(() => {
        if (currentMole === randomHole && gameActive) {
            currentMole.classList.remove('mole');
            spawnMole();
        }
    }, 1000);
}

function whackMole(hole) {
    if (!gameActive) return;
    
    if (hole === currentMole) {
        score++;
        scoreDisplay.textContent = score;
        hole.classList.remove('mole');
        spawnMole();
    }
}

startBtn.addEventListener('click', startGame);

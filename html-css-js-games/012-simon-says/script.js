let sequence = [];
let playerSequence = [];
let level = 1;
let gameActive = false;

const buttons = document.querySelectorAll('.button');
const levelDisplay = document.getElementById('level');
const messageDisplay = document.getElementById('message');
const startBtn = document.getElementById('startBtn');

buttons.forEach(button => {
    button.addEventListener('click', playerClick);
});

function playerClick(e) {
    if (!gameActive) return;
    
    const button = e.target;
    const color = button.getAttribute('data-color');
    
    playerSequence.push(color);
    playSound(color);
    
    // BUG: Checking wrong index - should use playerSequence.length - 1
    if (playerSequence[playerSequence.length] !== sequence[playerSequence.length]) {
        messageDisplay.textContent = 'Game Over! Final Level: ' + level;
        gameActive = false;
        startBtn.disabled = false;
        return;
    }
    
    if (playerSequence.length === sequence.length) {
        level++;
        levelDisplay.textContent = level;
        messageDisplay.textContent = 'Great! Get ready...';
        playerSequence = [];
        setTimeout(nextRound, 1500);
    }
}

function nextRound() {
    const colors = ['1', '2', '3', '4'];
    sequence.push(colors[Math.floor(Math.random() * 4)]);
    playSequence();
}

function playSequence() {
    messageDisplay.textContent = 'Watch and repeat...';
    let delay = 500;
    
    sequence.forEach((color, index) => {
        setTimeout(() => {
            const button = document.getElementById('btn' + color);
            playSound(color);
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 300);
        }, delay);
        delay += 600;
    });
    
    setTimeout(() => {
        messageDisplay.textContent = 'Your turn!';
        gameActive = true;
    }, delay);
}

function playSound(color) {
    // Simple visual feedback (in real game would play audio)
    console.log('Sound: ' + color);
}

startBtn.addEventListener('click', () => {
    sequence = [];
    playerSequence = [];
    level = 1;
    levelDisplay.textContent = level;
    startBtn.disabled = true;
    nextRound();
});

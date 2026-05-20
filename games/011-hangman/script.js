const words = ['JAVASCRIPT', 'PROGRAMMING', 'HANGMAN', 'COMPUTER', 'DEVELOPER'];
let word = '';
let guessed = [];
let wrong = 0;
const maxWrong = 6;

const wordDisplay = document.getElementById('word');
const messageDisplay = document.getElementById('message');
const remainingDisplay = document.getElementById('remaining');
const buttons = document.querySelectorAll('.letter');
const resetBtn = document.getElementById('resetBtn');

function startGame() {
    word = words[Math.floor(Math.random() * words.length)];
    guessed = [];
    wrong = 0;
    messageDisplay.textContent = '';
    
    buttons.forEach(btn => {
        btn.disabled = false;
    });
    
    updateDisplay();
}

function guessLetter(letter) {
    if (guessed.includes(letter)) return;
    
    guessed.push(letter);
    
    // BUG: Wrong condition - should check if letter is IN word
    if (!word.includes(letter)) {
        wrong++;
    } else {
        wrong--;  // This makes wrong negative!
    }
    
    remainingDisplay.textContent = maxWrong - wrong;
    
    if (wrong >= maxWrong) {
        messageDisplay.textContent = 'Game Over! Word was: ' + word;
        buttons.forEach(btn => btn.disabled = true);
    }
    
    if (isWordComplete()) {
        messageDisplay.textContent = 'You Won!';
        buttons.forEach(btn => btn.disabled = true);
    }
    
    updateDisplay();
}

function isWordComplete() {
    return word.split('').every(letter => guessed.includes(letter));
}

function updateDisplay() {
    wordDisplay.textContent = word.split('').map(letter => 
        guessed.includes(letter) ? letter : '_'
    ).join(' ');
    
    buttons.forEach(btn => {
        if (guessed.includes(btn.textContent)) {
            btn.disabled = true;
        }
    });
}

resetBtn.addEventListener('click', startGame);
startGame();

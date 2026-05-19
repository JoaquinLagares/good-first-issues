let headsCount = 0;
let tailsCount = 0;
let totalFlips = 0;

const coin = document.getElementById('coin');
const resultDisplay = document.getElementById('result');
const headsBtn = document.getElementById('headsBtn');
const tailsBtn = document.getElementById('tailsBtn');
const resetBtn = document.getElementById('resetBtn');

const headsCountDisplay = document.getElementById('headsCount');
const tailsCountDisplay = document.getElementById('tailsCount');
const totalFlipsDisplay = document.getElementById('totalFlips');

function flipCoin(prediction) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    coin.textContent = result === 'Heads' ? '🪙' : '🪙';
    
    // BUG: Counters are not being updated!
    if (result === 'Heads') {
        // headsCount++;
    } else {
        // tailsCount++;
    }
    
    // totalFlips++;
    
    if (result === prediction) {
        resultDisplay.textContent = 'You won!';
    } else {
        resultDisplay.textContent = 'You lost!';
    }
    
    // Update displays
    headsCountDisplay.textContent = headsCount;
    tailsCountDisplay.textContent = tailsCount;
    totalFlipsDisplay.textContent = totalFlips;
}

headsBtn.addEventListener('click', () => flipCoin('Heads'));
tailsBtn.addEventListener('click', () => flipCoin('Tails'));

resetBtn.addEventListener('click', () => {
    headsCount = 0;
    tailsCount = 0;
    totalFlips = 0;
    resultDisplay.textContent = '';
    coin.textContent = '?';
    
    headsCountDisplay.textContent = 0;
    tailsCountDisplay.textContent = 0;
    totalFlipsDisplay.textContent = 0;
});

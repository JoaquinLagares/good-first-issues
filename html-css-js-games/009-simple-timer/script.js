let totalSeconds = 0;
let isRunning = false;
let intervalId = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');

function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    minutesDisplay.textContent = String(mins).padStart(2, '0');
    secondsDisplay.textContent = String(secs).padStart(2, '0');
}

function startTimer() {
    if (!isRunning) {
        const mins = parseInt(minutesInput.value) || 0;
        const secs = parseInt(secondsInput.value) || 0;
        totalSeconds = mins * 60 + secs;
        
        if (totalSeconds <= 0) {
            message.textContent = 'Enter a valid time!';
            return;
        }
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        message.textContent = '';
        
        intervalId = setInterval(() => {
            totalSeconds++;  // BUG: Should be decrementing, not incrementing!
            updateDisplay();
            
            if (totalSeconds <= 0) {
                clearInterval(intervalId);
                isRunning = false;
                message.textContent = 'Time\'s up!';
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

function resetTimer() {
    clearInterval(intervalId);
    totalSeconds = 0;
    isRunning = false;
    minutesDisplay.textContent = '00';
    secondsDisplay.textContent = '00';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    message.textContent = '';
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();

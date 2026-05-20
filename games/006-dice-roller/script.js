let rollCount = 0;
const rollBtn = document.getElementById('rollBtn');
const die1 = document.getElementById('die1');
const die2 = document.getElementById('die2');
const totalDisplay = document.getElementById('total');
const rollCountDisplay = document.getElementById('rollCount');

rollBtn.addEventListener('click', function() {
    // BUG: Random should be between 1-6, but range is 0-5
    const result1 = Math.floor(Math.random() * 6);
    const result2 = Math.floor(Math.random() * 6);
    
    die1.textContent = result1;
    die2.textContent = result2;
    
    const total = result1 + result2;
    totalDisplay.textContent = total;
    
    rollCount++;
    rollCountDisplay.textContent = rollCount;
});

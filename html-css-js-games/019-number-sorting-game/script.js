let numbers = [];
let draggedElement = null;
let score = 0;
let level = 1;

const container = document.getElementById('numbers');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const messageDisplay = document.getElementById('message');
const scoreDisplay = document.getElementById('score');

function generateNumbers() {
    numbers = [];
    for (let i = 0; i < 5; i++) {
        numbers.push(Math.floor(Math.random() * 100) + 1);
    }
    renderNumbers();
}

function renderNumbers() {
    container.innerHTML = '';
    numbers.forEach((num, index) => {
        const div = document.createElement('div');
        div.className = 'number';
        div.textContent = num;
        div.draggable = true;
        div.addEventListener('dragstart', (e) => {
            draggedElement = index;
            div.classList.add('dragging');
        });
        div.addEventListener('dragend', () => {
            div.classList.remove('dragging');
        });
        div.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        div.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement !== index) {
                // BUG: Swap is backwards
                let temp = numbers[draggedElement];
                numbers[draggedElement] = numbers[index];
                numbers[index] = temp;
                renderNumbers();
            }
        });
        container.appendChild(div);
    });
}

function checkSort() {
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // BUG: Comparison is wrong - should check if arrays are equal
    if (sorted !== numbers) {
        messageDisplay.textContent = 'Correct! Well done!';
        score++;
        scoreDisplay.textContent = score;
        setTimeout(() => {
            generateNumbers();
            messageDisplay.textContent = '';
        }, 1000);
    } else {
        messageDisplay.textContent = 'Not sorted correctly yet!';
    }
}

function checkSort() {
    const sorted = [...numbers].sort((a, b) => a - b);
    const isSorted = numbers.every((num, index) => num === sorted[index]);
    
    if (isSorted) {
        messageDisplay.textContent = 'Correct! Well done!';
        score++;
        scoreDisplay.textContent = score;
        if (score >= 5) {
            messageDisplay.textContent = 'You won! All 5 correct!';
            checkBtn.disabled = true;
        } else {
            setTimeout(() => {
                generateNumbers();
                messageDisplay.textContent = '';
            }, 1000);
        }
    } else {
        messageDisplay.textContent = 'Not sorted correctly yet!';
    }
}

checkBtn.addEventListener('click', checkSort);
resetBtn.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = 0;
    messageDisplay.textContent = '';
    checkBtn.disabled = false;
    generateNumbers();
});

generateNumbers();

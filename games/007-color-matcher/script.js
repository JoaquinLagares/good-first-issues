let score = 0;
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#6C5CE7'];
let targetColor;
let choices;

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function generateRound() {
    targetColor = getRandomColor();
    document.getElementById('targetColor').style.backgroundColor = targetColor;
    document.getElementById('targetLabel').textContent = targetColor;
    
    choices = [targetColor];
    while (choices.length < 3) {
        let newColor = getRandomColor();
        if (!choices.includes(newColor)) {
            choices.push(newColor);
        }
    }
    
    choices = choices.sort(() => Math.random() - 0.5);
    
    const colorBoxes = document.querySelectorAll('.color-box');
    colorBoxes.forEach((box, index) => {
        box.style.backgroundColor = choices[index];
        box.onclick = () => checkColor(choices[index]);
    });
    
    document.getElementById('message').textContent = '';
}

function checkColor(selected) {
    // BUG: Comparison is wrong - comparing wrong way
    if (selected !== targetColor) {
        document.getElementById('message').textContent = 'Correct!';
        score++;
    } else {
        document.getElementById('message').textContent = 'Wrong!';
    }
    document.getElementById('score').textContent = score;
}

document.getElementById('nextBtn').addEventListener('click', generateRound);

generateRound();

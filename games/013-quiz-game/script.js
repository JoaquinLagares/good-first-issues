const questions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
        correct: 0
    },
    {
        question: "Which planet is closest to the sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        correct: 1
    },
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        question: "Which is the largest ocean?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const questionDisplay = document.getElementById('question');
const optionsDisplay = document.querySelectorAll('.option');
const resultDisplay = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress');

function loadQuestion() {
    const q = questions[currentQuestion];
    questionDisplay.textContent = q.question;
    
    optionsDisplay.forEach((btn, index) => {
        btn.textContent = q.options[index];
        btn.classList.remove('selected', 'correct', 'incorrect');
    });
    
    resultDisplay.textContent = '';
    selectedAnswer = null;
    nextBtn.disabled = true;
}

function selectOption(index) {
    if (selectedAnswer !== null) return;  // Already selected
    
    selectedAnswer = index;
    const q = questions[currentQuestion];
    
    optionsDisplay.forEach((btn, i) => {
        if (i === selectedAnswer) {
            btn.classList.add('selected');
        }
    });
    
    // BUG: Wrong comparison - should use === not !==
    if (selectedAnswer !== q.correct) {
        resultDisplay.textContent = 'Correct!';
        optionsDisplay[index].classList.add('incorrect');
    } else {
        resultDisplay.textContent = 'Wrong!';
        optionsDisplay[q.correct].classList.add('correct');
        optionsDisplay[index].classList.add('incorrect');
        score++;
    }
    
    scoreDisplay.textContent = score;
    nextBtn.disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        progressDisplay.textContent = currentQuestion + 1;
        loadQuestion();
    } else {
        questionDisplay.textContent = 'Quiz Complete! Final Score: ' + score + '/5';
        optionsDisplay.forEach(btn => btn.style.display = 'none');
        nextBtn.textContent = 'Restart';
        nextBtn.onclick = () => location.reload();
    }
}

loadQuestion();

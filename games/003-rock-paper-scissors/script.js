let playerScore = 0;
let computerScore = 0;

const choices = document.querySelectorAll('.choice');
const resultDisplay = document.getElementById('result');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const resetBtn = document.getElementById('resetBtn');

choices.forEach(choice => {
    choice.addEventListener('click', function() {
        const playerChoice = this.getAttribute('data-choice');
        const computerChoice = getComputerChoice();
        
        const result = determineWinner(playerChoice, computerChoice);
        resultDisplay.textContent = `You: ${playerChoice} | Computer: ${computerChoice} - ${result}`;
        
        playerScoreDisplay.textContent = playerScore;
        computerScoreDisplay.textContent = computerScore;
    });
});

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
}

function determineWinner(player, computer) {
    if (player === computer) {
        return "It's a Draw!";
    }
    
    // BUG: Win conditions are wrong!
    if (player === 'rock' && computer === 'scissors') {
        computerScore++;
        return 'You Lose!';
    }
    if (player === 'paper' && computer === 'rock') {
        computerScore++;
        return 'You Lose!';
    }
    if (player === 'scissors' && computer === 'paper') {
        computerScore++;
        return 'You Lose!';
    }
    
    playerScore++;
    return 'You Win!';
}

resetBtn.addEventListener('click', function() {
    playerScore = 0;
    computerScore = 0;
    playerScoreDisplay.textContent = 0;
    computerScoreDisplay.textContent = 0;
    resultDisplay.textContent = '';
});

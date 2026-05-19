let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    
    if (board[index] !== '') return;
    
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    
    if (checkWin()) {
        // BUG: Wrong player is announced as winner
        statusDisplay.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'} Wins!`;
        cells.forEach(cell => cell.style.pointerEvents = 'none');
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        statusDisplay.textContent = "It's a Draw!";
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

resetBtn.addEventListener('click', function() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
});

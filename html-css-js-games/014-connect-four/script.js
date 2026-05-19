let board = Array(42).fill(null);  // 6 rows x 7 cols
let currentPlayer = 'red';
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => makeMove(index));
});

function makeMove(index) {
    const col = parseInt(cells[index].getAttribute('data-col'));
    
    // Find the lowest empty cell in this column
    let targetIndex = -1;
    for (let i = 35; i >= 0; i -= 7) {
        if (i % 7 === col && board[i] === null) {
            targetIndex = i;
            break;
        }
    }
    
    if (targetIndex === -1) return;  // Column full
    
    board[targetIndex] = currentPlayer;
    cells[targetIndex].classList.add(currentPlayer);
    
    if (checkWin(targetIndex)) {
        // BUG: Announcement swaps players
        statusDisplay.textContent = `Player ${currentPlayer === 'red' ? 'yellow' : 'red'} Wins!`;
        cells.forEach(c => c.style.pointerEvents = 'none');
        return;
    }
    
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    statusDisplay.textContent = `Player ${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s Turn`;
}

function checkWin(index) {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const player = board[index];
    
    // Check horizontal
    for (let c = Math.max(0, col - 3); c <= Math.min(6, col + 3); c++) {
        for (let i = 0; i < 4; i++) {
            if (board[row * 7 + c + i] === player &&
                board[row * 7 + c + i + 1] === player &&
                board[row * 7 + c + i + 2] === player &&
                board[row * 7 + c + i + 3] === player) {
                return true;
            }
        }
    }
    
    // Simplified - real implementation would check vertical and diagonal
    return false;
}

resetBtn.addEventListener('click', () => {
    board = Array(42).fill(null);
    currentPlayer = 'red';
    cells.forEach(cell => {
        cell.classList.remove('red', 'yellow');
        cell.style.pointerEvents = 'auto';
    });
    statusDisplay.textContent = `Player Red's Turn`;
});

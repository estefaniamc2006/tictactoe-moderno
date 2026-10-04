const cells = document.querySelectorAll('.cell');
const statusSpan = document.getElementById('current-player');
const winnerBanner = document.getElementById('winner-banner');
const winnerText = document.getElementById('winner-text');
const restartBtn = document.getElementById('restart-btn');
const historyList = document.getElementById('history-list');

let history = [{
    squares: Array(9).fill(null),
    xIsNext: true
}];
let stepNumber = 0;

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return null;
}

function renderBoard() {
    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);

    cells.forEach((cell, index) => {
        const val = current.squares[index];
        cell.textContent = val ? val : '';
        cell.className = 'cell';
        if (val === 'X') cell.classList.add('x');
        if (val === 'O') cell.classList.add('o');
    });

    if (winInfo) {
        winnerText.textContent = `¡Jugador ${winInfo.winner} Gana! 🎉`;
        winnerBanner.classList.remove('hidden');
        statusSpan.parentElement.style.display = 'none';
    } else if (stepNumber === 9) {
        winnerText.textContent = `¡Empate! 🤝`;
        winnerBanner.classList.remove('hidden');
        statusSpan.parentElement.style.display = 'none';
    } else {
        winnerBanner.classList.add('hidden');
        statusSpan.parentElement.style.display = 'block';
        statusSpan.textContent = current.xIsNext ? 'X' : 'O';
        statusSpan.className = current.xIsNext ? 'player-x' : 'player-o';
    }

    updateHistoryButtons();
}

function handleClick(index) {
    const current = history[stepNumber];
    if (calculateWinner(current.squares) || current.squares[index]) {
        return;
    }

    const newSquares = current.squares.slice();
    newSquares[index] = current.xIsNext ? 'X' : 'O';

    history = history.slice(0, stepNumber + 1);
    history.push({
        squares: newSquares,
        xIsNext: !current.xIsNext
    });
    stepNumber++;

    renderBoard();
}

function jumpTo(step) {
    stepNumber = step;
    renderBoard();
}

function updateHistoryButtons() {
    historyList.innerHTML = '';
    history.forEach((step, move) => {
        const btn = document.createElement('button');
        btn.className = `history-btn ${move === stepNumber ? 'active' : ''}`;
        btn.textContent = move === 0 ? 'Ir al inicio' : `Ir al movimiento #${move}`;
        btn.onclick = () => jumpTo(move);
        historyList.appendChild(btn);
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        handleClick(index);
    });
});

restartBtn.addEventListener('click', () => {
    history = [{ squares: Array(9).fill(null), xIsNext: true }];
    stepNumber = 0;
    renderBoard();
});

renderBoard();

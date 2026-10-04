// ========================================
// ELEMENTOS DE LA PÁGINA
// ========================================

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

const startBtn = document.getElementById('start-btn');
const errorMessage = document.getElementById('error-message');

const cells = document.querySelectorAll('.cell');

const statusSpan = document.getElementById('current-player');

const winnerBanner = document.getElementById('winner-banner');
const winnerText = document.getElementById('winner-text');

const restartBtn = document.getElementById('restart-btn');

const historyList = document.getElementById('history-list');


// ========================================
// INFORMACIÓN DE LOS JUGADORES
// ========================================

let player1 = '';
let player2 = '';


// ========================================
// HISTORIAL DEL JUEGO
// ========================================

let history = [
    {
        squares: Array(9).fill(null),
        xIsNext: true
    }
];

let stepNumber = 0;


// ========================================
// COMENZAR PARTIDA
// ========================================

startBtn.addEventListener('click', startGame);


// También permite comenzar presionando Enter
player1Input.addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
        player2Input.focus();
    }

});


player2Input.addEventListener('keydown', (event) => {

    if (event.key === 'Enter') {
        startGame();
    }

});


function startGame() {

    const name1 = player1Input.value.trim();
    const name2 = player2Input.value.trim();


    // ========================================
    // VALIDAR NOMBRES
    // ========================================

    if (name1 === '') {

        errorMessage.textContent =
            'Por favor, ingresa el nombre del Jugador 1.';

        player1Input.focus();

        return;
    }


    if (name2 === '') {

        errorMessage.textContent =
            'Por favor, ingresa el nombre del Jugador 2.';

        player2Input.focus();

        return;
    }


    if (name1.toLowerCase() === name2.toLowerCase()) {

        errorMessage.textContent =
            'Los jugadores deben tener nombres diferentes.';

        player2Input.focus();

        return;
    }


    // ========================================
    // GUARDAR NOMBRES
    // ========================================

    player1 = name1;
    player2 = name2;


    // Limpiar mensaje de error
    errorMessage.textContent = '';


    // ========================================
    // MOSTRAR JUEGO
    // ========================================

    startScreen.classList.add('hidden');

    gameScreen.classList.remove('hidden');


    // Inicializar partida
    resetGame();

}


// ========================================
// DETERMINAR GANADOR
// ========================================

function calculateWinner(squares) {

    const lines = [

        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]

    ];


    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];


        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {

            return {
                winner: squares[a],
                line: [a, b, c]
            };

        }

    }


    return null;
}


// ========================================
// MOSTRAR TABLERO
// ========================================

function renderBoard() {

    const current = history[stepNumber];

    const winInfo = calculateWinner(current.squares);


    // ========================================
    // MOSTRAR CASILLAS
    // ========================================

    cells.forEach((cell, index) => {

        const value = current.squares[index];


        cell.textContent = value ? value : '';

        cell.className = 'cell';


        if (value === 'X') {
            cell.classList.add('x');
        }


        if (value === 'O') {
            cell.classList.add('o');
        }

    });


    // ========================================
    // HAY GANADOR
    // ========================================

    if (winInfo) {

        const winnerName =
            winInfo.winner === 'X'
                ? player1
                : player2;


        winnerText.textContent =
            `¡${winnerName} Gana! 🎉`;


        winnerBanner.classList.remove('hidden');

        statusSpan.parentElement.style.display = 'none';


    }

    // ========================================
    // EMPATE
    // ========================================

    else if (stepNumber === 9) {

        winnerText.textContent =
            '¡Empate! 🤝';


        winnerBanner.classList.remove('hidden');

        statusSpan.parentElement.style.display = 'none';

    }

    // ========================================
    // JUEGO CONTINÚA
    // ========================================

    else {

        winnerBanner.classList.add('hidden');

        statusSpan.parentElement.style.display = 'block';


        if (current.xIsNext) {

            statusSpan.textContent = player1;

            statusSpan.className = 'player-x';

        }

        else {

            statusSpan.textContent = player2;

            statusSpan.className = 'player-o';

        }

    }


    updateHistoryButtons();

}


// ========================================
// REALIZAR MOVIMIENTO
// ========================================

function handleClick(index) {

    const current = history[stepNumber];


    // No permitir movimientos después de terminar
    if (
        calculateWinner(current.squares) ||
        current.squares[index]
    ) {

        return;

    }


    const newSquares =
        current.squares.slice();


    // Jugador 1 = X
    // Jugador 2 = O

    newSquares[index] =
        current.xIsNext
            ? 'X'
            : 'O';


    // Eliminar movimientos posteriores
    history =
        history.slice(0, stepNumber + 1);


    // Agregar nuevo movimiento
    history.push({

        squares: newSquares,

        xIsNext: !current.xIsNext

    });


    stepNumber++;


    renderBoard();

}


// ========================================
// IR A UN MOVIMIENTO ANTERIOR
// ========================================

function jumpTo(step) {

    stepNumber = step;

    renderBoard();

}


// ========================================
// ACTUALIZAR HISTORIAL
// ========================================

function updateHistoryButtons() {

    historyList.innerHTML = '';


    history.forEach((step, move) => {

        const button =
            document.createElement('button');


        button.className =
            `history-btn ${
                move === stepNumber
                    ? 'active'
                    : ''
            }`;


        button.textContent =
            move === 0
                ? 'Ir al inicio'
                : `Ir al movimiento #${move}`;


        button.onclick = () =>
            jumpTo(move);


        historyList.appendChild(button);

    });

}


// ========================================
// CLIC EN LAS CASILLAS
// ========================================

cells.forEach(cell => {

    cell.addEventListener('click', (event) => {

        const index =
            parseInt(
                event.target.getAttribute('data-index')
            );


        handleClick(index);

    });

});


// ========================================
// REINICIAR PARTIDA
// ========================================

restartBtn.addEventListener('click', () => {

    resetGame();

});


// ========================================
// FUNCIÓN PARA REINICIAR EL TABLERO
// ========================================

function resetGame() {

    history = [

        {
            squares: Array(9).fill(null),
            xIsNext: true
        }

    ];


    stepNumber = 0;


    renderBoard();

}
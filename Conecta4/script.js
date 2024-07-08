const rows = 6;
const columns = 7;
let currentPlayer = 'red';
let board = [];
let redWins = 0;
let yellowWins = 0;

function createBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; // Limpiar el contenido del tablero existente
    board = []; // Inicializar una nueva matriz para el tablero

    for (let y = 0; y < rows; y++) {
        const row = []; // Crear una nueva fila
        for (let x = 0; x < columns; x++) {
            const cell = document.createElement('div'); // Crear una celda del tablero
            cell.dataset.column = x; // Asignar el índice de la columna como atributo de datos
            cell.dataset.row = y; // Asignar el índice de la fila como atributo de datos
            cell.addEventListener('click', handleCellClick); // Añadir un listener de evento para manejar los clics
            row.push(''); // Añadir una celda vacía a la fila
            boardElement.appendChild(cell); // Añadir la celda al tablero en el DOM
        }
        board.push(row); // Añadir la fila al tablero
    }
}

function handleCellClick(event) {
    const column = event.target.dataset.column; // Obtener el índice de la columna desde el atributo de datos
    if (!column) return; // Si no hay columna, salir de la función

    for (let y = rows - 1; y >= 0; y--) { // Iterar desde la última fila hasta la primera
        if (board[y][column] === '') { // Encontrar la primera celda vacía en la columna
            board[y][column] = currentPlayer; // Colocar la ficha del jugador actual en la celda
            const cell = document.querySelector(`#board div[data-column='${column}'][data-row='${y}']`); // Seleccionar la celda en el DOM
            cell.classList.add(currentPlayer); // Añadir la clase del jugador actual a la celda para cambiar su color
            if (checkWin(y, column)) { // Verificar si la jugada actual resulta en una victoria
                setTimeout(() => alert(`${currentPlayer} wins!`), 100); // Mostrar una alerta indicando que el jugador actual ha ganado
                if (currentPlayer === 'red') { // Si el jugador actual es rojo, incrementar su contador de victorias
                    redWins++;
                    document.getElementById('redWins').innerText = redWins; // Actualizar el contador en el DOM
                } else {
                    yellowWins++; // Si el jugador actual es amarillo, incrementar su contador de victorias
                    document.getElementById('yellowWins').innerText = yellowWins; // Actualizar el contador en el DOM
                }
                createBoard(); // Reiniciar el tablero
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red'; // Cambiar al siguiente jugador
            }
            break; // Salir del bucle una vez que la ficha ha sido colocada
        }
    }
}

function checkDirection(row, column, rowStep, colStep) {
    let count = 1; // Iniciar con 1 ya que se cuenta la ficha actual
    let color = board[row][column]; // Color de la ficha inicial

    // Verificar en una dirección
    for (let i = 1; i < 4; i++) {
        let newRow = row + i * rowStep; // Calcular la nueva fila
        let newCol = column + i * colStep; // Calcular la nueva columna

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns) {
            break; // Si la nueva posición está fuera del tablero, salir del bucle
        }

        if (board[newRow][newCol] === color) {
            count++; // Incrementar el contador si la ficha es del mismo color
        } else {
            break; // Si la ficha no es del mismo color, salir del bucle
        }
    }

    // Verificar en la dirección opuesta
    for (let i = 1; i < 4; i++) {
        let newRow = row - i * rowStep; // Calcular la nueva fila
        let newCol = column - i * colStep; // Calcular la nueva columna

        if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= columns) {
            break; // Si la nueva posición está fuera del tablero, salir del bucle
        }

        if (board[newRow][newCol] === color) {
            count++; // Incrementar el contador si la ficha es del mismo color
        } else {
            break; // Si la ficha no es del mismo color, salir del bucle
        }
    }

    return count >= 4; // Devolver true si hay cuatro o más fichas consecutivas del mismo color
}

function checkWin(row, column) {
    return checkDirection(row, column, 0, 1) || // Horizontal
           checkDirection(row, column, 1, 0) || // Vertical
           checkDirection(row, column, 1, 1) || // Diagonal ascendente
           checkDirection(row, column, 1, -1)  // Diagonal 
           checkDirection(row, column, -1, 1) || // Diagonal inversa ascendente
           checkDirection(row, column, -1, -1) // Diagonal inversa descendente
}

document.getElementById('resetGame').addEventListener('click', createBoard);
document.getElementById('resetScores').addEventListener('click', () => {
    redWins = 0; // Reiniciar el contador de victorias del jugador rojo
    yellowWins = 0; // Reiniciar el contador de victorias del jugador amarillo
    document.getElementById('redWins').innerText = redWins; // Actualizar el contador en el DOM
    document.getElementById('yellowWins').innerText = yellowWins; // Actualizar el contador en el DOM
    createBoard(); // Reiniciar el tablero
});

createBoard();


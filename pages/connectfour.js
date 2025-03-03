const ROWS = 6;
const COLS = 7;
var board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
var currentPlayer = "red";
var message;
var gameBoard;
var gameOver = false;


// Wait til page is loaded
document.addEventListener("DOMContentLoaded", () => {

    gameBoard = document.getElementById("board");
    message = document.getElementById("message");



    function createBoard() {
        gameBoard.innerHTML = ""; // Clear the board
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell"); // Cell styling

                // Store column index in cell dataset
                cell.dataset.column = c;

                gameBoard.appendChild(cell);
            }
        }
    }




    function dropPiece(column) {
        if(gameOver) return;

        for (let r = ROWS - 1; r >= 0; r--) { // Start from bottom row up
            if (!board[r][column]) { // Find first empty slot
                board[r][column] = currentPlayer; // Assign with either red or yellow
                animateDrop(r, column, currentPlayer);

                if (checkWin(r, column)) {
                    message.textContent = `${currentPlayer.toUpperCase()} wins!`;
                    // gameBoard.removeEventListener("click", handleClick); // Remove listener on game end
                    gameOver = true;
                } else { // If game is still going, switch player
                    currentPlayer = currentPlayer === "red" ? "yellow" : "red";
                    message.textContent = `${currentPlayer.toUpperCase()}'s turn`;
                }
                
                return;
            }
        }
    }




    function checkWin(row, col) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1] // Horizontal, Vertical, Diagonal (/), Diagonal (\)
        ];

        // Check how many same-color pieces exist in opposite directions of current piece
        for (const [dr, dc] of directions) {
            let count = 1;
            count += countPieces(row, col, dr, dc); // Count first direction
            count += countPieces(row, col, -dr, -dc); // Count opposite direction
            if (count >= 4) return true;
        }
        return false;
    }



    // Count number of pieces given a certain direction
    function countPieces(row, col, dr, dc) {
        let r = row + dr;
        let c = col + dc;
        let count = 0;

        // Count pieces in direction (dr, dc)
        while (r >= 0 && c >= 0 && r < ROWS && c < COLS && board[r][c] === currentPlayer) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }



    

    function animateDrop(row, column, player) {
        const piece = document.createElement("div");
        piece.classList.add("piece", player); // add piece with red or yellow class
        gameBoard.appendChild(piece);
        // Animate drop with CSS
        piece.style.setProperty("--drop-col", column);
        setTimeout(() => {
            piece.style.setProperty("--drop-row", row);
        }, 50);
    }




    function handleClick(event) {
        if (event.target.classList.contains("cell")) {
            // Drop piece given column dataset index
            dropPiece(parseInt(event.target.dataset.column));
        }
    }

    gameBoard.addEventListener("click", handleClick);
    createBoard();
});



// Reset button logic
document.getElementById("reset-button").addEventListener("click", function () {
    // Remove all the pieces from the game board
    document.querySelectorAll(".piece").forEach(piece => piece.remove());

    // Reset board logic
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null)); // reset board array
    currentPlayer = "red"; 
    message.textContent = `RED's turn`;

    gameOver = false;
    createBoard();
});

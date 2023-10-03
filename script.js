const gameBoard = (function (){
    gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    const markedCells = Array(9).fill(false);

    function getGameBoardArray() {
        return gameBoardArray;
    };

    function isCellMarked(index) {
        return markedCells[index];
    };

    function makeMove(index, marker) {
        if (!markedCells[index]) { 
            getGameBoardArray()[index] = marker;
            markedCells[index] = true; 
        }
    };

    function checkForWin() {
        const winningCombinations = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6],
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            const board = getGameBoardArray();
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === "X" ? "Player 1" : "Player 2";
            }
        }
        return null;
    };

    function checkForTie() {
        console.log('Checking for tie.');
        return getGameBoardArray().every((cell, index) => isCellMarked(index));
    }

    function resetGame() {
        getGameBoardArray().fill("");
        markedCells.fill(false);
    };

    return {
        getGameBoardArray,
        isCellMarked,
        makeMove,
        checkForWin,
        checkForTie,
        resetGame
    };

})();

const userInputModule = (function() {
    const player1Input = document.querySelector("#player1");
    const player2Input = document.querySelector("#player2");
    const startButton = document.querySelector("#start-button");

    function hideForm() {
        document.querySelector(".player-form").style.display = "none";
    };

    function showGameBoard() {
        document.querySelector(".game-board").style.display = "block";
    };

    function getPlayerNames() {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();

        return {player1Name, player2Name};
    };

    function startGameClick(callback) {
        startButton.addEventListener("click", () => {
            const {player1Name, player2Name} = getPlayerNames();
            if (player1Name && player2Name) {
                hideForm();
                showGameBoard();
                callback(player1Name, player2Name);
            }else {
                alert("Please enter names for both players")
            }
        });
    };
    return {
        startGameClick
    };

})();

function player(name, marker) {
    return { name, marker };
};

const displayController = (function (){
    const boardElements = document.querySelectorAll(".cell");
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    function initializeGame() {
        const { player1Name, player2Name } = userInputModule.getPlayerNames();
        currentPlayer = player(player1Name, "X");
        player1 = player(player1Name, "X");
        player2 = player(player2Name, "O");
        currentPlayer = player1;
    };

    function handleCellClick(event) {
        if (gameOver) return;
        const clickedCell = event.target;
        const cellIndex = Number(clickedCell.getAttribute("data-index"));
        const currentCellValue = gameBoard.getGameBoardArray()[cellIndex];
        const isCellMarked = gameBoard.isCellMarked(cellIndex);

        if (!isCellMarked && currentCellValue === "") {
            gameBoard.makeMove(cellIndex, currentPlayer.marker);
            clickedCell.textContent = currentPlayer.marker;

            currentPlayer = currentPlayer === player1 ? player2 : player1;

            checkForWinOrTie();
        } 
    };

    function checkForWinOrTie() {
        const winner = gameBoard.checkForWin();
        if (winner) {
            console.log(`Player ${winner} wins!`);
            alert(`Player ${winner} wins!`);
            gameOver = true;
        }  else if (!gameOver && gameBoard.checkForTie()) {
            console.log("It's a tie!");
            alert("It's a tie!");
            gameOver = true;
        } 
    }

    userInputModule.startGameClick((player1Name, player2Name) => {
        initializeGame(player1Name, player2Name);
    });

    boardElements.forEach((cell) => {
        cell.addEventListener("click", handleCellClick);
    });

})();
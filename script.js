const playerLogic = (function (){
    const gameBoardArray = ["", "", "", "", "", "", "", "", ""];
    const markedCells = Array(9).fill(false);

    function getGameBoardArray() {
        return gameBoardArray;
    };

    function isCellEmpty(index) {
        return markedCells[index] === false;
    };

    function makeMove(index, marker) {
        if (!isCellEmpty(index)) { 
            return;
        } 
        getGameBoardArray()[index] = marker;
        markedCells[index] = true; 
        checkForWinOrTie();
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
                return board[a];
            }
        }
        return null;
    };

    function checkForTie() {
        return getGameBoardArray().every((cell, index) => !isCellEmpty(index));
    };

    function checkForWinOrTie() {
        const winnerMarker = checkForWin();
        const tie = checkForTie();
    
        if (winnerMarker) {
            return { result: "win", marker: winnerMarker };
        } else if (tie) {
            return { result: "tie" };
        }
        return { result: "continue" };
    };

    function resetGame() {
        gameBoardArray.fill("");
        
        markedCells.fill(false);
    };

    function findBestMove(board, computerMarker) {
        let bestMove = -1;
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = computerMarker;
                const score = minimax(board, 0, false);
                board[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    };

    return {
        makeMove,
        getGameBoardArray,
        checkForWin,
        checkForTie,
        checkForWinOrTie,
        resetGame,
        findBestMove
    };
})();


const computerLogic = (function () {
    const boardElements = document.querySelectorAll(".cell");

    function makeComputerMove() {
        const emptyCells = playerLogic.getGameBoardArray().map((cell, index) => (cell === "") ? index : -1).filter(index => index !== -1);
    
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const selectedCellIndex = emptyCells[randomIndex];
            const computerMarker = initializeGame.getCurrentPlayer().marker; 

            gameController.handleCellSelection(boardElements[selectedCellIndex], selectedCellIndex, { name: "Computer", marker: computerMarker });
        }
    };

    function makeComputerMoveMinimax() {
        const bestMove = playerLogic.findBestMove(playerLogic.getGameBoardArray(), computerMarker);
        // Update the game board and UI with the best move
    };

    return {
        makeComputerMove,
        makeComputerMoveMinimax
    };
})();

const initializeGame = (function() {
    const player = { name: "", marker: "" };
    const computerPlayer = { name: "Computer", marker: "" };
    let currentPlayer = player;
    let gameOver = false;

    function initializePlayers(playerName, playerMarker, computerMarker) {
        player.name = playerName;
        player.marker = playerMarker;
        computerPlayer.marker = computerMarker;
    };

    function getCurrentPlayer() {
        return currentPlayer;
    };

    function switchPlayer() {
        currentPlayer = (currentPlayer === player) ? computerPlayer : player;
    };

    function isGameOver() {
        return gameOver;
    };

    function setGameOver(status) {
        gameOver = status;
    };

    function restartGame() {
        playerLogic.resetGame();
        currentPlayer = player;
        gameOver = false;
        player.name = ""; 
        player.marker = ""; 
        computerPlayer.marker = "";
    };

    return {
        initializePlayers,
        switchPlayer,
        getCurrentPlayer,
        isGameOver,
        setGameOver,
        restartGame
    };
})();

const gameController = (function() {
    const boardElements = document.querySelectorAll(".cell");
    const restartButton = document.querySelector("#restart-button");

    function handleCellClick(event) {
        if (initializeGame.isGameOver()) {
            return;
        }

        const clickedCell = event.target;
        const cellIndex = Number(clickedCell.getAttribute("data-index"));
        const currentPlayer = initializeGame.getCurrentPlayer();

        if (currentPlayer.name === "Computer") {
            if (difficultyLevel === "easy") {
                computerLogic.makeComputerMove(); // Basic AI
            } else if (difficultyLevel === "hard") {
                computerLogic.makeComputerMoveMinimax(); // Minimax AI
            }
        }

       /*  if (currentPlayer.name === "Computer") {
            computerLogic.makeComputerMove();
            return;
        }     */
        
        handleCellSelection(clickedCell, cellIndex, currentPlayer);
    };

    function handleCellSelection(cell, index, player) {
        if (initializeGame.isGameOver()) {
            return;
        }

        cell.textContent = player.marker;
        playerLogic.makeMove(index, player.marker);

        initializeGame.switchPlayer();

        const result = playerLogic.checkForWinOrTie();
        if (result.result === "win") {
            gamePresentation.showGameResult(player.name, false);
            initializeGame.setGameOver(true);
        } else if (result.result === "tie") {
            gamePresentation.showGameResult(null, true);
            initializeGame.setGameOver(true);
        } else if (initializeGame.getCurrentPlayer().name === "Computer") {
            computerLogic.makeComputerMove();
        }

    };

    function handleRestartButtonClick() {
        initializeGame.restartGame();

        gamePresentation.clearGameBoardUI();
        gamePresentation.clearResultMessageUI();
        gamePresentation.clearPlayerInputsUI(); 
        gamePresentation.showGameSetupUI();

    };

    boardElements.forEach((cell) => {
        cell.addEventListener("click", handleCellClick);
    });

    restartButton.addEventListener("click", handleRestartButtonClick);

    return {
        handleCellSelection
    };
})();

const gamePresentation = (function () {
    function showGameResult(winnerName, isTie) {
        const resultMessage = document.querySelector(".result-message");

        if (winnerName) {
            if (winnerName === "Computer") {
                resultMessage.textContent = `${winnerName} wins!`;
                console.log(`${winnerName} wins!`);
            } else {
                resultMessage.textContent = `${winnerName} wins!`;
                console.log(`${winnerName} wins!`);
            }
        } else if (isTie) {
            resultMessage.textContent = "It's a tie!";
            console.log("It's a tie!");
        } else {
            resultMessage.textContent = "";
        }
    };

    function clearGameBoardUI() {
        const boardElements = document.querySelectorAll(".cell");
        boardElements.forEach((cell) => {
            cell.textContent = "";
        });
    }

    function clearResultMessageUI() {
        const resultMessage = document.querySelector(".result-message");
        resultMessage.textContent = "";
    }

    function clearPlayerInputsUI() {
        const playerNameInput = document.querySelector("#player-name");
        playerNameInput.value = "";

        const playerXMarker = document.querySelector("#player-x");
        const playerOMarker = document.querySelector("#player-o");
    }

    function showGameSetupUI() {
        const gameSetupElement = document.querySelector("#game-setup");
        gameSetupElement.style.visibility = "visible";
    }

    return {
        showGameResult,
        clearGameBoardUI,
        clearResultMessageUI,
        clearPlayerInputsUI,
        showGameSetupUI
    };
})();

const playerInputController = (function() {
    const playerNameInput = document.querySelector("#player-name");
    const gameBoardElement = document.querySelector(".game-board");
    const startButton = document.querySelector("#start-button");
    const errorMessage = document.querySelector(".error-message");

    function startGameClick() {
        const playerName = playerNameInput.value.trim();
        const playerMarker = document.querySelector('input[name="player-marker"]:checked').value;
        const computerMarker = document.querySelector('input[name="computer-marker"]:checked').value;

        if (playerName) {
            initializeGame.initializePlayers(playerName, playerMarker, computerMarker);

            gameBoardElement.style.visibility = "visible";
            errorMessage.textContent = "";
        } else {
            errorMessage.textContent = "Please enter your name";
        }
    };

    startButton.addEventListener("click", startGameClick);

    return {
        startGameClick
    };
})();

const display = (function () {
    let update = grid => {
        for (let i = 0; i < grid.length; i++) {
            let j = i + 1
            let selection = document.querySelector(`.square:nth-Child(${j}) span`);
            if (grid[i]) selection.textContent = grid[i];
            else selection.textContent = "";
        }
    }
    let displayWinner = (player) => {
        let selection = document.querySelector('.announcement');
        let heading = document.createElement('h1');
        heading.textContent = `${player.name} wins!`;
        selection.appendChild(heading);
    }
    let resetWinner = () => {
        let selection = document.querySelector('.announcement');
        selection.textContent = "";
    }
    return { update, displayWinner, resetWinner };
})();



const gameGrid = (function () {
    let grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const rowWin = ['012', '345', '678'];
    const colWin = ['036', '147', '258'];
    const diagWin = ['048', '246'];
    let over = false;

    const makeMove = (cell, player) => {
        if (validateMove(cell)) {
            grid[cell] = player.symbol;
            display.update(grid);
            checkWin(player);
        }

    }

    const validateMove = (cell) => {
        if (over) return false;
        if (!grid[cell]) {
            return true;
        }
        return false;
    }

    const resetGrid = () => {
        grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        over = false;
        display.update(grid);
        display.resetWinner();
    }

    const winTrue = (board, winCondition) => {
        let count = 0;
        for (let i = 0; i < winCondition; i++) {
            if (board.includes(winCondition[i])) count++;
        }
        return (count === 3);
    }

    const checkWin = (player) => {
        let win = false;
        let board = "";

        for (let i = 0; i < 9; i++) {
            if (grid[i] === player.symbol) board += i;
        }
        for (let i in rowWin) {
            if (winTrue(board, rowWin[i])) win = true;
        }
        for (let i in colWin) {
            if (winTrue(board, colWin[i])) win = true;
        }
        for (let i in diagWin) {
            if (winTrue(board, diagWin[i])) win = true;
        }

        if (win) {
            display.displayWinner(player);
            over = true;
            return true;
        }
        else return false;
    }
    return { makeMove, resetGrid }
})();

function playerFactory(name, symbol) {
    return { name, symbol };
}

const game = (function () {
    let player1;
    let player2;
    let turn = 0;
    const reset = () => {
        let form = document.forms[0];
        let form2 = document.forms[1];
        if (form.elements['player-1'].id) {
            player1 = playerFactory(form.elements['player-1'].value, 'x');
        }
        else {
            player1 = playerFactory('Player 1', 'x');
        }
        if (form2.elements['player-2'].value) {
            player2 = playerFactory(form2.elements['player-2'].value, 'o');
        }
        else {
            player2 = playerFactory('Player 2', 'o');
        }
        gameGrid.resetGrid();
        turn = 0;
    }
    const makeMove = cell => {
        switch (turn % 2) {
            case 0:
                gameGrid.makeMove(cell, player1);
                break;
            case 1:
                gameGrid.makeMove(cell, player2);
                break;
        }
        turn++;
        console.log(turn);
    }
    reset();
    return { reset, makeMove };
})();



const resetButton = document.querySelector('button.reset');
resetButton.addEventListener('click', event => {
    game.reset();
});

window.addEventListener('click', event => {
    if(event.target.classList[0]==='selection') game.makeMove(event.target.id-1);
})

'use strict';
const MINE = 'MINE';
const EMPTY = ' ';
const MINE_IMG = '💣'


// Model:
var gBoard;
var gBoardSize = 4;
var gLives = 3;
var gStartTime;
var gWatchInterval;


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

var gLevel = {
    size: 4,
    mines: 2
}


function changeLevel(elBtn, size, mines, levelName) {
    gLevel.size = size
    gLevel.mines = mines
    gBoardSize = size
    elBtn.innerHTML = levelName
    init()
}


function init() {
    gGame.isOn = true;
    gBoard = buildBoard();
    addMines();
    // console.log('gBoard', gBoard);
    renderBoard(gBoard);
    checkGameOver();

}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gBoardSize; i++) {
        board.push([]);
        for (var j = 0; j < gBoardSize; j++) {
            var cell = {
                minesAroundCount: setMinesNegsCount(),
                isShown: false,
                isMine: false,
                isMarked: false
            };

            board[i][j] = cell;
        }

    }

    // console.table(board);
    return board;
}


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            if (currCell !== MINE) {
                currCell = EMPTY;
            }
            var className = `cell cell-${i}-${j}`;

            if (currCell.isMine) {
                strHTML += MINE_IMG;

            }

            strHTML += `<td class="${className}" onclick="cellClicked(${i},${j},this)"oncontextmenu="cellMarked(this, ${i}, ${j})">${currCell}</td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}



function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    if (count === 0) { return EMPTY }
    else { return count }


}



function cellClicked(i, j, elCell) {
    startStopWatch()
    if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;

    gBoard[i][j].isShown = true;
    elCell.innerText = setMinesNegsCount(gBoard, i, j);
    elCell.style.backgroundColor = 'rgb(228, 115, 134)';
    gGame.shownCount++;
    if (gBoard[i][j].isMine) {
        elCell.style.backgroundColor = 'red';
        gLives--;
        elCell.classList.add('mine');
        elCell.innerText = EMPTY;
    }

    // console.table(gBoard);

}

function cellMarked(elCell, i, j) {
    checkGameOver();
    if (gBoard[i][j].isShown) return;
    window.event.preventDefault()
    if (elCell.classList.contains('marked')) {
        elCell.classList.remove('marked')
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
    } else {
        elCell.classList.add('marked')
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
    }

}



function addMines() {
    var n = 0
    while (n < gLevel.mines) {

        var pos = getEmptyPos();
        if (!pos) return;
        for (var i = 0; i < gLevel.size; i++) {
            gBoard[pos.i][pos.j].isMine = true;

        }
        n++;
    }

}


function checkGameOver() {
    var count = 0;
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && currCell.isMarked) {
                count++
            }
        }
    }
    if (count === gLevel.mines) {
        console.log('game over')
    }

}


// if (gGame.markedCount + gGame.shownCount === (gLevel.size ** 2)) {
// console.log('you win!')
//     gGame.isOn = false;

// }
// else if (gLives === 0) {
//     console.log('you lost!')
//     gGame.isOn = false;

// }
function expandShown(board, elCell, rowIdx, colIdx) {
    if (setMinesNegsCount(elCell) === 0 && board[rowIdx[colIdx.isMine = false]]) {
        return expandShown();
    }
};


function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    if (count === 0) { return EMPTY }
    else { return count }


}

// timer
function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1)
    gStartTime = Date.now()
}

function updateWatch() {
    var now = Date.now()
    var time = ((now - gStartTime) / 1000).toFixed(2)
    var elTime = document.querySelector('.time')
    elTime.innerText = time
}

function endStopWatch() {
    clearInterval(gWatchInterval)
    gWatchInterval = null
}


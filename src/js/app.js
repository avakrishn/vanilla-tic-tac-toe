'use-strict';

window.onload = function() {
  chooseBoardSize();
};

function chooseBoardSize() {
  let startingPlayer = true;
  const slider = document.querySelector('input');
  const boardValue = document.querySelector('.boardValue');
  const reset = document.querySelector('.reset');

  boardValue.innerText = slider.value;
  slider.addEventListener('change', updateValue);
  reset.addEventListener('click', resetGame);
  initGame(parseInt(slider.value), startingPlayer);

  function updateValue() {
    boardValue.innerText = this.value;
    initGame(parseInt(this.value), startingPlayer);
  }

  function resetGame() {
    const chooseText = document.querySelector('.chooseText');

    slider.disabled = false;
    slider.style.background = 'green';

    chooseText.innerText = 'Choose Your Board Size';

    startingPlayer = !startingPlayer;
    initGame(parseInt(slider.value), startingPlayer);
  }
}

function initGame(boardSize, startingPlayer) {
  const state = {
    size: boardSize,
    board: [],
    player: startingPlayer, // true = "X" and false = "O"
    remaining: boardSize * boardSize,
    lastButton: []
  };

  const game = document.querySelector('.game');
  const undo = document.querySelector('.undo');

  game.innerHTML = '';
  createBoard(game);

  undo.addEventListener('click', undoLastMove);

  function createBoard(game) {
    const n = state.size;
    const newBoard = new Array(n * n).fill(' ');
    let counter = 0;

    state.board = newBoard;

    for (let rows = 0; rows < n; rows++) {
      const row = document.createElement('div');
      row.classList.add(`row`, `row${rows}`);
      for (let cols = 0; cols < n; cols++) {
        const btn = document.createElement('button');
        btn.classList.add(`col`, `btn${counter}`);
        btn.addEventListener('click', handleClick);
        btn.setAttribute('data', counter);

        row.append(btn);
        counter++;
      }
      game.append(row);
    }

    displayBoard();
  }

  function handleClick() {
    const slider = document.querySelector('input');
    const chooseText = document.querySelector('.chooseText');
    const btn = this;
    const btnID = btn.getAttribute('data');

    if (state.remaining === state.size * state.size) {
      slider.disabled = true;
      slider.style.background = 'grey';
      chooseText.innerText = 'Reset To Change Board';
    }

    state.board[btnID] = state.player ? 'X' : 'O';
    state.player = !state.player; // change to next player
    state.remaining--;
    state.lastButton.push(btnID);

    btn.disabled = true;

    displayBoard();
  }

  function displayBoard() {
    const n = state.size;
    const prevPlayer = !state.player ? 'X' : 'O';

    for (let i = 0; i < n * n; i++) {
      const btn = document.querySelector(`.btn${i}`);
      btn.innerText = state.board[i];
    }

    if (isTie()) {
      displayPlayerOrResult('Tie Game!');
    } else if (isWin()) {
      displayPlayerOrResult(`Player ${prevPlayer} Wins!`);
    } else {
      displayPlayerOrResult();
    }
  }

  function displayPlayerOrResult(result) {
    const player = document.querySelector('.player');
    const undo = document.querySelector('.undo');
    const allBtns = document.querySelectorAll('.game button');

    if (!result) {
      player.innerText = `Player: ${state.player ? 'X' : 'O'}`;
      if (state.remaining === state.size * state.size) {
        undo.disabled = true;
        undo.style.backgroundColor = 'grey';
      } else {
        undo.style.backgroundColor = 'green';
        undo.disabled = false;
      }
    } else {
      player.innerText = result;
      allBtns.forEach(btn => (btn.disabled = true));
      undo.disabled = true;
      undo.style.backgroundColor = 'grey';
      undo.removeEventListener('click', undoLastMove);
    }
  }

  function isTie() {
    return state.remaining === 0;
  }

  function isWin() {
    const rows = checkRows(),
      cols = checkColumns(),
      diagonals = checkDiagonals();

    return rows || cols || diagonals;
  }

  function checkRows() {
    const n = state.size;

    for (let i = 0; i < n * n; i = i + n) {
      const rowIndices = [];
      for (let index = i; index < i + n; index++) {
        rowIndices.push(index);
      }

      if (numMatches(rowIndices) === n) {
        markButtons(rowIndices);
        return true;
      }
    }

    return false;
  }

  function checkColumns() {
    const n = state.size;

    for (let i = 0; i < n; i++) {
      const columnIndices = [];
      for (let j = i; j < n * n; j = j + n) {
        columnIndices.push(j);
      }
      if (numMatches(columnIndices) === n) {
        markButtons(columnIndices);
        return true;
      }
    }
    return false;
  }

  function checkDiagonals() {
    const n = state.size;
    let d1 = 0,
      d2 = n - 1,
      diagonal1Indices = [],
      diagonal2Indices = [],
      diagonal1Matches,
      diagonal2Matches;
    count = 0;

    while (d1 < n * n) {
      diagonal1Indices.push(d1);
      d1 += n + 1;
    }
    while (d2 < n * n && count < n) {
      diagonal2Indices.push(d2);
      count++;
      d2 += n - 1;
    }

    diagonal1Matches = numMatches(diagonal1Indices);
    diagonal2Matches = numMatches(diagonal2Indices);

    if (diagonal1Matches === n) {
      markButtons(diagonal1Indices);
    }

    if (diagonal2Matches === n) {
      markButtons(diagonal2Indices);
    }

    if (diagonal1Matches === n || diagonal2Matches === n) {
      return true;
    }

    return false;
  }

  function numMatches(arr) {
    const prevPlayer = !state.player ? 'X' : 'O';

    return arr.reduce((total, element) => {
      return (total = state.board[element] === prevPlayer ? total + 1 : total);
    }, 0);
  }

  function undoLastMove() {
    const btnID = state.lastButton.pop();
    const btn = document.querySelector(`.btn${btnID}`);

    if (state.remaining === state.size * state.size) return;

    btn.disabled = false;
    state.player = !state.player;
    state.board[btnID] = ' ';
    state.remaining++;
    displayBoard();
  }

  function markButtons(indicesArr) {
    indicesArr.forEach(index => {
      const btn = document.querySelector(`.btn${index}`);
      btn.classList.add('hl');
    });
  }
}

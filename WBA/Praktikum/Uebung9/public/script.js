let playerName = '';
let board = [];
let currentPlayer = 1;

function startGame() {
  playerName = $('#name').val();
  if (!playerName) {
    alert('Bitte geben Sie Ihren Namen ein.');
    return;
  }
  $('#player-name').hide();
  initializeBoard();
}

function initializeBoard() {
  board = Array.from({ length: 6 }, () => Array(7).fill(0));
  renderBoard();
}

function renderBoard() {
  $('#board').empty();
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      const cell = $('<div>')
        .addClass('cell')
        .attr('data-row', row)
        .attr('data-col', col)
        .addClass(board[row][col] === 1 ? 'player1' : board[row][col] === 2 ? 'player2' : '');
      $('#board').append(cell);
    }
  }
  $('.cell').click(handleCellClick);
}

function handleCellClick(event) {
  const col = $(event.target).data('col');
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      renderBoard();
      if (checkWin(row, col)) {
        if (currentPlayer === 1) {
          alert('Sie haben gewonnen!');
          saveScore();
        } else {
          alert('Der Computer hat gewonnen!');
        }
        initializeBoard();
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer === 2) {
          setTimeout(computerMove, 500);  // Adding a delay for better user experience
        }
      }
      return;
    }
  }
}

function computerMove() {
  let col;
  do {
    col = Math.floor(Math.random() * 7);
  } while (board[0][col] !== 0);
  handleCellClick({ target: $(`[data-col="${col}"]`).get(0) });
}

function checkWin(row, col) {
  const directions = [
    { row: 0, col: 1 }, // horizontal
    { row: 1, col: 0 }, // vertical
    { row: 1, col: 1 }, // diagonal down-right
    { row: 1, col: -1 } // diagonal down-left
  ];

  for (let { row: rowDir, col: colDir } of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + i * rowDir;
      const c = col + i * colDir;
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    for (let i = 1; i < 4; i++) {
      const r = row - i * rowDir;
      const c = col - i * colDir;
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 4) {
      return true;
    }
  }
  return false;
}

function saveScore() {
  $.post('/save-score', { playerName, score: board.flat().filter(x => x !== 0).length }, () => {
    loadHighscores();
  });
}

function loadHighscores() {
  $.get('/highscores', (data) => {
    $('#score-list').empty();
    data.forEach(score => {
      $('#score-list').append(`<li>${score.playerName}: ${score.score}</li>`);
    });
  });
}

// Load highscores on page load
$(document).ready(loadHighscores);


class GameUI {
  constructor(size, container) {
    this.size = size;
    this.container = container;
  }
  renderCell(row, col, val) {
    const cell = document.createElement('div');
    cell.className = 'cell'
    cell.innerHTML = val === null ? '' : (val === 0 ? 'O' : 'X');

    if (val === null && !this.game.completed) {
      cell.onclick = () => {
        this.game.move(row, col);
        this.render();
      }
    }

    if (this.game.winner !== null) {
      const onWinPath = this.game.winPath.some(path => path === `${row}-${col}`);
      if (onWinPath) {
        cell.className += ' win';
      }
    }
    return cell;
  }
  renderGrid() {
    const container = document.createElement('div');
    this.game.grid.forEach((row, rowIndex) => {
      const rowDom = document.createElement('div');
      rowDom.className = 'row';
      container.appendChild(rowDom);
      row.forEach((cell, colIndex) => {
        rowDom.appendChild(this.renderCell(rowIndex, colIndex, cell))
      })
    })
    return container;
  }
  renderUser() {
    const container = document.createElement('div');


    const playerA = document.createElement('div');
    const playerB = document.createElement('div');

    container.appendChild(playerA);
    container.appendChild(playerB);

    playerA.innerHTML = `${this.game.currentPlayer === this.game.playerA ? '&bull;' : ''} playerA (O)`;
    playerB.innerHTML = `${this.game.currentPlayer === this.game.playerB ? '&bull;' : ''} playerB (X)`;
    if (this.game.winner !== null) {
      playerA.innerHTML = `playerA (O)${this.game.winner === this.game.playerA ? ' winner' : ''}`;
      playerB.innerHTML = `playerB (O)${this.game.winner === this.game.playerB ? ' winner' : ''}`;
    } else if (this.game.completed) {
      playerA.innerHTML = `playerA (O)`;
      playerB.innerHTML = `playerB (X)<br />Draw!!`;
    }

    return container;
  }
  renderRestart() {
    const btn = document.createElement('button');
    btn.innerHTML = 'Restart';
    btn.onclick = this.start.bind(this)
    return btn;
  }
  start() {
    this.game = new Game(this.size);
    this.render();
  }
  render() {
    this.container.innerHTML = '';

    this.container.appendChild(this.renderGrid());
    this.container.appendChild(this.renderUser());
    if (this.game.completed) {
      this.container.appendChild(this.renderRestart());
    }
  }
}

class Game {
  constructor(size = 3) {
    this.playerA = 0;
    this.playerB = 1;
    this.currentPlayer = this.playerA;
    this.size = size;
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      this.grid.push(new Array(this.size).fill(null));
    }
    this.winner = null;
    this.winPath = null;
    this.fillCount = 0;
    this.completed = false;
  }

  move(row, col) {
    this.grid[row][col] = this.currentPlayer;
    this.fillCount++;

    if (this.grid[row].every(cell => cell === this.currentPlayer)) {
      this.winner = this.currentPlayer;
      this.winPath = this.grid[row].map((c, i) => `${row}-${i}`);
    }
    if (this.grid.every(row => row[col] === this.currentPlayer)) {
      this.winner = this.currentPlayer;
      this.winPath = this.grid.map((r, i) => `${i}-${col}`);
    }

    if (row === col || this.size - row - 1 === col) {
      if (this.grid.every((row, index) => row[index] === this.currentPlayer)) {
        this.winner = this.currentPlayer;
        this.winPath = this.grid.map((r, i) => `${i}-${i}`);
      }
      if (this.grid.every((row, index) => row[this.size - index - 1] === this.currentPlayer)) {
        this.winner = this.currentPlayer;
        this.winPath = this.grid.map((r, i) => `${i}-${this.size - i - 1}`);
      }
    }
    this.completed = this.winner !== null || this.fillCount === this.size * this.size;
    this.currentPlayer = this.currentPlayer === this.playerA ? this.playerB : this.playerA;
  }
}


const gameUI = new GameUI(3, document.getElementById('app'));
gameUI.start();
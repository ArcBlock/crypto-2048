/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
/* eslint-disable operator-assignment */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-plusplus */
import React from 'react';

import Button from '@arcblock/ux/lib/Button';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      board: null,
      score: 0,
      gameOver: false,
      message: null,
    };
  }

  // Create board with two random coordinate numbers
  initBoard() {
    let board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    board = this.placeRandom(this.placeRandom(board));
    this.setState({
      board,
      score: 0,
      gameOver: false,
      message: null,
    });
  }

  // Get all blank coordinates from board
  getBlankCoordinates(board) {
    const blankCoordinates = [];

    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 0) {
          blankCoordinates.push([r, c]);
        }
      }
    }

    return blankCoordinates;
  }

  // Grab random start number
  randomStartingNumber() {
    const startingNumbers = [2, 4];
    const randomNumber = startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
    return randomNumber;
  }

  // Place random starting number on an empty coordinate
  placeRandom(board) {
    const blankCoordinates = this.getBlankCoordinates(board);
    const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
    const randomNumber = this.randomStartingNumber();
    board[randomCoordinate[0]][randomCoordinate[1]] = randomNumber;
    return board;
  }

  // Compares two boards to check for movement
  boardMoved(original, updated) {
    return JSON.stringify(updated) !== JSON.stringify(original);
  }

  // Moves board depending on direction and checks for game over
  move(direction) {
    if (!this.state.gameOver) {
      if (direction === 'up') {
        const movedUp = this.moveUp(this.state.board);
        if (this.boardMoved(this.state.board, movedUp.board)) {
          const upWithRandom = this.placeRandom(movedUp.board);

          if (this.checkForGameOver(upWithRandom)) {
            this.setState({ board: upWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: upWithRandom, score: (this.state.score += movedUp.score) });
          }
        }
      } else if (direction === 'right') {
        const movedRight = this.moveRight(this.state.board);
        if (this.boardMoved(this.state.board, movedRight.board)) {
          const rightWithRandom = this.placeRandom(movedRight.board);

          if (this.checkForGameOver(rightWithRandom)) {
            this.setState({ board: rightWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: rightWithRandom, score: (this.state.score += movedRight.score) });
          }
        }
      } else if (direction === 'down') {
        const movedDown = this.moveDown(this.state.board);
        if (this.boardMoved(this.state.board, movedDown.board)) {
          const downWithRandom = this.placeRandom(movedDown.board);

          if (this.checkForGameOver(downWithRandom)) {
            this.setState({ board: downWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: downWithRandom, score: (this.state.score += movedDown.score) });
          }
        }
      } else if (direction === 'left') {
        const movedLeft = this.moveLeft(this.state.board);
        if (this.boardMoved(this.state.board, movedLeft.board)) {
          const leftWithRandom = this.placeRandom(movedLeft.board);

          if (this.checkForGameOver(leftWithRandom)) {
            this.setState({ board: leftWithRandom, gameOver: true, message: 'Game over!' });
          } else {
            this.setState({ board: leftWithRandom, score: (this.state.score += movedLeft.score) });
          }
        }
      }
    } else {
      this.setState({ message: 'Game over. Please start a new game.' });
    }
  }

  moveUp(inputBoard) {
    const rotatedRight = this.rotateRight(inputBoard);
    let board = [];
    let score = 0;

    // Shift all numbers to the right
    for (let r = 0; r < rotatedRight.length; r++) {
      const row = [];
      for (let c = 0; c < rotatedRight[r].length; c++) {
        const current = rotatedRight[r][c];
        current === 0 ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to right
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
          score += board[r][c];
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }

    // Rotate board back upright
    board = this.rotateLeft(board);

    return { board, score };
  }

  moveRight(inputBoard) {
    const board = [];
    let score = 0;

    // Shift all numbers to the right
    for (let r = 0; r < inputBoard.length; r++) {
      const row = [];
      for (let c = 0; c < inputBoard[r].length; c++) {
        const current = inputBoard[r][c];
        current === 0 ? row.unshift(current) : row.push(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to right
    for (let r = 0; r < board.length; r++) {
      for (let c = board[r].length - 1; c >= 0; c--) {
        if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c - 1] = 0;
          score += board[r][c];
        } else if (board[r][c] === 0 && board[r][c - 1] > 0) {
          board[r][c] = board[r][c - 1];
          board[r][c - 1] = 0;
        }
      }
    }

    return { board, score };
  }

  moveDown(inputBoard) {
    const rotatedRight = this.rotateRight(inputBoard);
    let board = [];
    let score = 0;

    // Shift all numbers to the left
    for (let r = 0; r < rotatedRight.length; r++) {
      const row = [];
      for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
        const current = rotatedRight[r][c];
        current === 0 ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to left
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
          score += board[r][c];
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }

    // Rotate board back upright
    board = this.rotateLeft(board);

    return { board, score };
  }

  moveLeft(inputBoard) {
    const board = [];
    let score = 0;

    // Shift all numbers to the left
    for (let r = 0; r < inputBoard.length; r++) {
      const row = [];
      for (let c = inputBoard[r].length - 1; c >= 0; c--) {
        const current = inputBoard[r][c];
        current === 0 ? row.push(current) : row.unshift(current);
      }
      board.push(row);
    }

    // Combine numbers and shift to left
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board.length; c++) {
        if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
          board[r][c] = board[r][c] * 2;
          board[r][c + 1] = 0;
          score += board[r][c];
        } else if (board[r][c] === 0 && board[r][c + 1] > 0) {
          board[r][c] = board[r][c + 1];
          board[r][c + 1] = 0;
        }
      }
    }

    return { board, score };
  }

  rotateRight(matrix) {
    const result = [];

    for (let c = 0; c < matrix.length; c++) {
      const row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.push(matrix[r][c]);
      }
      result.push(row);
    }

    return result;
  }

  rotateLeft(matrix) {
    const result = [];

    for (let c = matrix.length - 1; c >= 0; c--) {
      const row = [];
      for (let r = matrix.length - 1; r >= 0; r--) {
        row.unshift(matrix[r][c]);
      }
      result.push(row);
    }

    return result;
  }

  // Check to see if there are any moves left
  checkForGameOver(board) {
    const moves = [
      this.boardMoved(board, this.moveUp(board).board),
      this.boardMoved(board, this.moveRight(board).board),
      this.boardMoved(board, this.moveDown(board).board),
      this.boardMoved(board, this.moveLeft(board).board),
    ];

    return !moves.includes(true);
  }

  componentWillMount() {
    this.initBoard();
    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e) {
    const up = 38;
    const right = 39;
    const down = 40;
    const left = 37;
    const n = 78;

    if (e.keyCode === up) {
      this.move('up');
    } else if (e.keyCode === right) {
      this.move('right');
    } else if (e.keyCode === down) {
      this.move('down');
    } else if (e.keyCode === left) {
      this.move('left');
    } else if (e.keyCode === n) {
      this.initBoard();
    }
  }

  render() {
    const onNewGame = () => {
      if (typeof this.props.onNewGame === 'function') {
        this.props.onNewGame(() => {
          this.initBoard();
        });
      } else {
        this.initBoard();
      }
    };

    const onBuyCoins = () => {
      if (typeof this.props.onBuyCoins === 'function') {
        this.props.onBuyCoins();
      }
    };

    return (
      <div>
        <div className="meta">
          <div className="score">
            Score:&nbsp;
            {this.state.score}
          </div>
          <div className="score">
            Coin:&nbsp;
            {this.props.chainInfo.chain.balance} {this.props.chainInfo.chain.token.symbol}
          </div>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onNewGame}
            disabled={this.props.chainInfo.chain.balance <= 0}>
            New Game
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={onBuyCoins}>
            Buy Coins
          </Button>
        </div>
        <table>
          <tbody>
            {this.state.board.map((row, i) => (
              <Row key={i} row={row} />
            ))}
          </tbody>
        </table>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

const Row = ({ row }) => (
  <tr>
    {row.map((cell, i) => (
      <Cell key={i} cellValue={cell} />
    ))}
  </tr>
);

const Cell = ({ cellValue }) => {
  let color = 'cell';
  const value = cellValue === 0 ? '' : cellValue;
  if (value) {
    color += ` color-${value}`;
  }

  return (
    <td>
      <div className={color}>
        <div className="number">{value}</div>
      </div>
    </td>
  );
};

import React from 'react';
import Square from './Square';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pieces: {
        red: {0: 'n', 2: 'n', 4: 'n', 6: 'n', 9:'n', 11:'n', 13:'n', 15:'n', 16:'n', 18:'n', 20:'n', 22:'n'},
        blue: {63:'n', 61:'n', 59:'n', 57:'n', 54:'n', 52:'n', 50:'n', 48:'n', 47:'n', 45:'n', 43:'n', 41:'n'},
        possible: {something: 'something'},
        selected: -1,
      },
      turn: 'blue',
      notTurn: 'red',

    }
    this.handleClick = this.handleClick.bind(this);
    this.movePiece = this.movePiece.bind(this);
    this.possibleBlue = this.possibleBlue.bind(this);
    this.possibleRed = this.possibleRed.bind(this);
    this.possibleKing = this.possibleKing.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.checkJump = this.checkJump.bind(this);
  }

  movePiece(square) {
    let cur = this.state.selected;
    let target = (Number(square) - Number(cur))/2 + Number(cur);
    let { pieces, turn, notTurn } = this.state;
    let curPiece = square;
    let jumped = false;
    if( this.state.pieces.blue[target] ) {
      delete this.state.pieces.blue[target];
      console.log('deleted a piece');
      jumped = true;
    }
    if( this.state.pieces.red[target] ) {
      delete this.state.pieces.red[target];
      console.log('deleted a piece');
      jumped = true;
    }
    var typePiece = pieces[this.state.turn][this.state.selected];
    pieces[this.state.turn][this.state.selected] = undefined;
    //make the piece a king if it's at the end
    if(this.state.turn === 'red') {
      pieces[this.state.turn][square] = square > 55 ? 'k' : typePiece;
    }
    else {
      pieces[this.state.turn][square] = square < 8 ? 'k' : typePiece;
    }
    //return to base case
    return { pieces, curPiece, jumped };
  }
  possibleBlue(square) {
    let posMoves = {};
    let blues = this.state.pieces.blue;
    let reds = this.state.pieces.red;
    var curState = this.state;
    if(square % 8 === 0) {
      if(reds[square-7] && !reds[square-14] && square-14 > 0 && !blues[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
        posMoves[square-14] = 'p';
      }
      else if(!blues[square-7]) posMoves[square - 7] = 'p';
    }
    else if(square % 8 === 7) {
      if(reds[square-9] && !reds[square-18] && square-18 > 0 && !blues[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
        posMoves[square-18] = 'p';
      }
      else if(!blues[square-9]) posMoves[square-9] = 'p';
    }
    else {
      if(reds[square-7] && !reds[square-14] && square-14 > 0 && !blues[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
        posMoves[square-14] = 'p';
      } else {
        if(reds[square-9] && !reds[square-18] && square-18 > 0 && !blues[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
          posMoves[square-18] = 'p';
        } else {
          if(!blues[square-7] && !reds[square-7]) posMoves[square - 7] = 'p';
          if(!blues[square-9] && !reds[square-9]) posMoves[square - 9] = 'p';
        }
      }
    }
    curState.pieces.possible = posMoves;
    curState.selected = square;
    return curState;
  }

  possibleRed(square) {
    let posMoves = {};
    let blues = this.state.pieces.blue;
    let reds = this.state.pieces.red;
    var curState = this.state;
    if(square % 8 === 0) {
      if(blues[square+9] && !blues[square+18] && square+18 < 64 && !reds[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
        posMoves[square+18] = 'p';
      }
      else if(!reds[square+9]) {
        posMoves[square + 9] = 'p';
      }
    }
    else if(square % 8 === 7) {
      if(blues[square+7] && !blues[square+14] && square+14 < 64 && !reds[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
        posMoves[square+14] = 'p';
      }
      else if(!reds[square+7]) {
        posMoves[square + 7] = 'p';
      }
    }
    else {
      if(blues[square+9] && !blues[square+18] && square+18 < 64 && !reds[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
        posMoves[square+18] = 'p';
      } else {
        if(blues[square+7] && !blues[square+14] && square+14 < 64 && !reds[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
          posMoves[square+14] = 'p';
        } else {
          if(!reds[square+9] && !blues[square+9]) posMoves[square + 9] = 'p';
          if(!reds[square+7] && !blues[square+7]) posMoves[square + 7] = 'p';
        }
      }
    }
    curState.pieces.possible = posMoves;
    curState.selected = square;
    return curState;
  }

  possibleKing(square) {
    let posMoves = {};
    let friends = this.state.turn === 'blue' ? this.state.pieces.blue: this.state.pieces.red;
    let enemies = this.state.turn === 'red' ? this.state.pieces.blue: this.state.pieces.red;
    var curState = this.state;
    if(square % 8 === 0) {
      if(enemies[square+9] && !enemies[square+18] && square+18 < 64 && !friends[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
        posMoves[square+18] = 'p';
      }
      if(enemies[square-7] && !enemies[square-14] && square-14 > 0 && !friends[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
        posMoves[square-14] = 'p';
      }
      if(!friends[square+9] && !enemies[square+9]) {
        posMoves[square + 9] = 'p';
      }
      if(!friends[square-7] && !enemies[square-7]) {
        posMoves[square - 7] = 'p';
      }
    }
    else if(square % 8 === 7) {
      if(enemies[square+7] && !enemies[square+14] && square+14 < 64 && !friends[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
        posMoves[square+14] = 'p';
      }
      if(enemies[square-9] && !enemies[square-18] && square-18 > 0 && !friends[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
        posMoves[square-18] = 'p';
      }
      if(!friends[square+7] && !enemies[square+7]) {
        posMoves[square + 7] = 'p';
      }
      if(!friends[square-9] && !enemies[square-9]) {
        posMoves[square - 9] = 'p';
      }
    }
    else {
      if(enemies[square+9] && !enemies[square+18] && square+18 < 64 && !friends[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
        posMoves[square+18] = 'p';
      }
      if(enemies[square-9] && !enemies[square-18] && square-18 > 0 && !friends[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
        posMoves[square-18] = 'p';
      }
      if(enemies[square+7] && !enemies[square+14] && square+14 < 64 && !friends[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
        posMoves[square+14] = 'p';
      }
      if(enemies[square-7] && !enemies[square-14] && square-14 > 0 && !friends[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
        posMoves[square-14] = 'p';
      }
      if(!friends[square+9] && !enemies[square+9]) {
        posMoves[square + 9] = 'p';
      }
      if(!friends[square-9] && !enemies[square-9]) {
        posMoves[square - 9] = 'p';
      }
      if(!friends[square+7] && !enemies[square+7]) {
        posMoves[square + 7] = 'p';
      }
      if(!friends[square-7] && !enemies[square-7]) {
        posMoves[square - 7] = 'p';
      }
    }
    curState.pieces.possible = posMoves;
    curState.selected = square;
    return curState;
  }

  checkJump(square, pieces) {
    let posMoves = {};
    let turn = this.state.turn;
    let blues = pieces.blue;
    let reds = pieces.red;
    var curState = this.state;
    let friends = this.state.turn === 'blue' ? this.state.pieces.blue: this.state.pieces.red;
    let enemies = this.state.turn === 'red' ? this.state.pieces.blue: this.state.pieces.red;
//blue piece
    if(pieces[turn][square] === 'n' && turn === 'blue') {
      if(square % 8 === 0) {
        if(reds[square-7] && !reds[square-14] && square-14 > 0 && !blues[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
          posMoves[square-14] = 'p';
        }
      }
      else if(square % 8 === 7) {
        if(reds[square-9] && !reds[square-18] && square-18 > 0 && !blues[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
          posMoves[square-18] = 'p';
        }
      }
      else {
        if(reds[square-7] && !reds[square-14] && square-14 > 0 && !blues[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) {
          posMoves[square-14] = 'p';
        } else {
          if(reds[square-9] && !reds[square-18] && square-18 > 0 && !blues[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) {
            posMoves[square-18] = 'p';
          }
        }
      }
//red piece
    } else if(pieces[turn][square] === 'n' && turn === 'red') {
      if(square % 8 === 0) {
        if(blues[square+9] && !blues[square+18] && square+18 < 64 && !reds[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
          posMoves[square+18] = 'p';
        }
      }
      else if(square % 8 === 7) {
        if(blues[square+7] && !blues[square+14] && square+14 < 64 && !reds[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
          posMoves[square+14] = 'p';
        }
      }
      else {
        if(blues[square+9] && !blues[square+18] && square+18 < 64 && !reds[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) {
          posMoves[square+18] = 'p';
        } else {
          if(blues[square+7] && !blues[square+14] && square+14 < 64 && !reds[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) {
            posMoves[square+14] = 'p';
          }
        }
      }
//king

    } else {
      if(square % 8 === 0) {
        if(enemies[square+9] && !enemies[square+18] && square+18 < 64 && !friends[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) posMoves[square+18] = 'p';
        if(enemies[square-7] && !enemies[square-14] && square-14 > 0 && !friends[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) posMoves[square-14] = 'p';
      }
      else if(square % 8 === 7) {
        if(enemies[square+7] && !enemies[square+14] && square+14 < 64 && !friends[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) posMoves[square+14] = 'p';
        if(enemies[square-9] && !enemies[square-18] && square-18 > 0 && !friends[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) posMoves[square-18] = 'p';
      }
      else {
        if(enemies[square+9] && !enemies[square+18] && square+18 < 64 && !friends[square+18] && (square+9)%8 !== 7 && (square+9)%8 !== 0) posMoves[square+18] = 'p';
        if(enemies[square-9] && !enemies[square-18] && square-18 > 0 && !friends[square-18] && (square-9)%8 !== 7 && (square-9)%8 !== 0) posMoves[square-18] = 'p';
        if(enemies[square+7] && !enemies[square+14] && square+14 < 64 && !friends[square+14] && (square+7)%8 !== 7 && (square+7)%8 !== 0) posMoves[square+14] = 'p';
        if(enemies[square-7] && !enemies[square-14] && square-14 > 0 && !friends[square-14] && (square-7)%8 !== 7 && (square-7)%8 !== 0) posMoves[square-14] = 'p';
      }
    }
    //check if there are possible moves, if there are, figure out a way to take those moves
    console.log('possible second jumps', posMoves);
    if(Object.keys(posMoves).length < 1) {
      return;
    } else {
      console.log('hello');
      curState.pieces = pieces;
      curState.pieces.possible = posMoves;
      curState.selected = square;
      return curState;
    }
  }

  handleClick(square) {
    if(this.state.selected !== -1 && this.state.pieces.possible[square] === 'p' ) {
      let moveResult = this.movePiece(square);
      let pieces = moveResult.pieces;
      let newPiece = moveResult.curPiece;
      //checks if an additional jump can performed, nothing happens if not
      if(this.checkJump(square, pieces) && moveResult.jumped) {
        this.setState(this.checkJump(square, pieces));
        return;
      }

      pieces.possible = {};
      let turn = this.state.turn === 'blue' ? 'red' : 'blue';
      let notTurn = this.state.notTurn === 'blue' ? 'red' : 'blue';
      if(this.checkWin()) {
        alert(`The winner is ${this.checkWin()}`);
      }
      this.setState({ pieces: pieces, turn: turn, notTurn: notTurn });
      return;
    }
    let posMoves = {};
    //king can move anywhere
    if( (this.state.pieces.red[square] === 'k' || this.state.pieces.blue[square] === 'k')  ) {
      this.setState(this.possibleKing(square));
      return;
    }
    //blue can only move up
    if(this.state.turn === 'blue' && this.state.pieces.blue[square] === 'n') {
      this.setState(this.possibleBlue(square));
      return;
    }
    //red can only move down
    if(this.state.turn === 'red' && this.state.pieces.red[square] === 'n') {
      this.setState(this.possibleRed(square));
      return;
    }
  }

  checkWin() {
    let red = false;
    let blue = false;
    for(let i = 0; i < Object.keys(this.state.pieces.blue).length; i++) {
      if(this.state.pieces.blue[Object.keys(this.state.pieces.blue)[i]] !== undefined) blue = true;
    }
    for(let i = 0; i < Object.keys(this.state.pieces.red).length; i++) {
      if(this.state.pieces.red[Object.keys(this.state.pieces.red)[i]] !== undefined) red = true;
    }
    if(!blue && red) return 'red';
    if(!red && blue) return 'blue';
    return;
  }

  render() {
    let squares = [];
    for(let i = 0; i < 64; i++) {
      squares.push(<Square id={i} key={i} pieces={this.state.pieces} highlight={this.handleClick} />)
    }
    return (
      <div>
        <h1>Checkers game</h1>
        <div id="board">
          {squares}
        </div>
      </div>
    )
  }
}

export default App;
import React, { Component } from 'react'
import './app.css'
import { connect } from 'react-redux'

interface BoardProps {}
interface BoardState {
  arrayOfX
  playerMove
  winner
  x
  o
}

export class Board extends Component<BoardProps, BoardState> {
  constructor(props) {
    super(props)
    this.state = {
      arrayOfX: [null, null, null, null, null, null, null, null, null],
      playerMove: true,
      winner: null,
      x: 0,
      o: 0,
    }
  }

  resetGame = () => {
    this.setState({
      arrayOfX: [null, null, null, null, null, null, null, null, null],
      playerMove: true,
      winner: null,
    })
  }

  counter = () => {
    if (this.state.winner === 'x') {
      this.setState({
        x: this.state.x + 1,
      })
    } else {
      this.setState({
        o: this.state.o + 1,
      })
    }
  }

  componentDidUpdate = () => {
    /* everytime state or props of boards changes */
    if (!this.state.winner) {
      /* if winner is not null/undefined aka there is  winner , then stop checking state*/
      if (
        this.state.arrayOfX[0] === this.state.arrayOfX[1] &&
        this.state.arrayOfX[1] === this.state.arrayOfX[2] &&
        this.state
          .arrayOfX[2] /* the last condition [2] checks if the element exists aka not null */
      ) {
        this.setState(
          {
            winner: this.state.arrayOfX[0] /* this sets the winner */,
          },
          () => {
            this.counter()
          }
        )
      }
    }
  }

  switchMove = index => {
    const positionArrayCopy = this.state.arrayOfX.map((el, i) => {
      return index === i ? (this.state.playerMove ? 'x' : 'o') : el
    })

    this.setState({
      playerMove: !this.state.playerMove,
      arrayOfX: positionArrayCopy,
    })
  }

  render() {
    return (
      <div>
        {'Player x = ' +
          this.state.x +
          'points | Player o = ' +
          this.state.o +
          ' points'}
        {this.state.winner ? this.state.winner + ' wins!' : null}
        {this.state.winner ? (
          <button onClick={this.resetGame}>Play Again</button>
        ) : null}
        <div className="board">
          {this.state.arrayOfX.map((el, i) => {
            return (
              <Square
                key={i}
                position={i}
                value={el}
                switchMove={this.switchMove}
              />
            )
          })}
        </div>
      </div>
    ) /* i tracks the position of each square in the array */
  }
}

interface SquareProps {
  value
  switchMove
  position
}
export class Square extends Component<SquareProps> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="square">
        <button
          onClick={() => {
            if (this.props.value === null) {
              this.props.switchMove(this.props.position)
            }
          }}
        >
          {this.props.value}
        </button>
      </div>
    )
  }
}

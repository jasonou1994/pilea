import React, { Component } from 'react'
import './app.css'
import { connect } from 'react-redux'

interface BoardProps {}
interface BoardState {
  arrayOfX
}

export class Board extends Component<BoardProps, BoardState> {
  constructor(props) {
    super(props)
    this.state = {
      arrayOfX: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    }
  }

  render() {
    return (
      <div>
        <div className="board">
          {this.state.arrayOfX.map(el => {
            return <Square value={el} />
          })}
        </div>
      </div>
    )
  }
}

interface SquareProps {
  value
}
export class Square extends Component<SquareProps> {
  constructor(props) {
    super(props)
  }

  render() {
    return <div className="square">{this.props.value}</div>
  }
}

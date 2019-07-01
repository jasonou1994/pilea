import React, { Component } from 'react'
import { connect } from 'react-redux'

interface CreateUserProps {}

interface CreateUserState {}

export class CreateUser extends Component<CreateUserProps, CreateUserState> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        CreateUser
      </div>
    )
  }
}

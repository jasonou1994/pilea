import React, { Component } from 'react'
import PlaidLink from 'react-plaid-link'
import { PLAID_PUBLIC_KEY } from '../konstants'
import { FetchAddItemActionCreator } from '../actions'

interface AddNewItemProps {
  fetchAddItemAction: FetchAddItemActionCreator
}

interface AddNewItemState {
  isShownItemAliasEntry: boolean
  accessToken?: string
  alias?: string
}

export class AddNewItem extends Component<AddNewItemProps, AddNewItemState> {
  constructor(props) {
    super(props)
    this.state = {
      isShownItemAliasEntry: false,
    }
  }

  hideItemAliasEntry: () => void = () =>
    this.setState({ isShownItemAliasEntry: false })

  showItemAliasEntry: () => void = () =>
    this.setState({ isShownItemAliasEntry: true })

  setAccessToken: (token: string) => void = token =>
    this.setState(
      {
        accessToken: token,
      },
      this.showItemAliasEntry
    )

  setAliasText: (alias: string) => void = alias => this.setState({ alias })

  render: () => JSX.Element = () => {
    const { isShownItemAliasEntry } = this.state
    const { fetchAddItemAction } = this.props

    return isShownItemAliasEntry ? (
      <div>
        <input
          type="text"
          placeholder="Enter a nickname for this financial institution."
          onChange={({ target: { value } }) => this.setAliasText(value)}
        />
        <button
          onClick={() => {
            const { alias, accessToken } = this.state
            fetchAddItemAction({ accessToken, alias })
            this.hideItemAliasEntry()
            this.setAliasText('')
          }}
        >
          Confirm
        </button>
      </div>
    ) : (
      <div
        style={{
          border: '1px solid green',
          padding: '5px',
        }}
      >
        <PlaidLink
          clientName="Pilea"
          env={'development'}
          product={['transactions']}
          publicKey={PLAID_PUBLIC_KEY}
          onSuccess={this.setAccessToken}
        >
          Add Institution
        </PlaidLink>
      </div>
    )
  }
}

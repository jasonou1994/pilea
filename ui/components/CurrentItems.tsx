import React, { Component } from 'react'
import { ItemWithCards } from '../reducers/transactionsAccounts'

interface CurrentItemsProps {
  cardsByItems: ItemWithCards[]
}

interface CurrentItemsState {}

export class CurrentItems extends Component<
  CurrentItemsProps,
  CurrentItemsState
> {
  render() {
    const { cardsByItems } = this.props
    //moment().format('MMMM Do YYYY, h:mm:ss a')
    return (
      <div
        style={{
          border: '1px solid green',
          padding: '5px',
        }}
      >
        CurrentItems
        {cardsByItems.length >= 0 ? (
          cardsByItems.map(item => {
            return (
              <div key={item.id}>
                <h4>{item.alias ? item.alias : item.accessToken}</h4>
                {item.cards.map(card => {
                  return (
                    <div key={card.account_id}>
                      <div>
                        {card.official_name ? card.official_name : card.name}
                      </div>
                      <div>{card.balances.available}</div>
                      <div>{card.balances.current}</div>
                    </div>
                  )
                })}
              </div>
            )
          })
        ) : (
          <div>Please add an institution to continue.</div>
        )}
      </div>
    )
  }
}

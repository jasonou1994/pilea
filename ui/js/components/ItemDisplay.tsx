import React, { FunctionComponent } from 'react'
import { ItemWithCards } from '../reducers'
import numeral from 'numeral'
import { FetchRemoveItemActionCreator } from '../actions'
import { Button } from './common/Button'

interface ItemDisplayProps {
  item: ItemWithCards
  fetchRemoveItemAction: FetchRemoveItemActionCreator
}

export const ItemDisplay: FunctionComponent<ItemDisplayProps> = ({
  item: { id, accessToken, alias, cards },
  fetchRemoveItemAction,
}) => (
  <div className="item-display">
    <div className="item-header">
      <h4>{alias ? alias : accessToken}</h4>
      <Button
        type="normal"
        disabled={false}
        text="Remove "
        onClick={() => {
          fetchRemoveItemAction(id)
        }}
      ></Button>
    </div>

    {cards.map(
      ({
        official_name,
        account_id,
        name,
        balances: { available, current },
      }) => (
        <div key={account_id} className="card-group">
          <div className="card-name">
            {official_name ? official_name : name}
          </div>

          <div>
            <span className="currency currency-balance">
              {numeral(current).format('$0,0.00')}
            </span>
            <span className="currency-type">balance</span>
          </div>
          <div>
            <span className="currency currency-available">
              {numeral(available).format('$0,0.00')}
            </span>
            <span className="currency-type">available</span>
          </div>
        </div>
      )
    )}
  </div>
)

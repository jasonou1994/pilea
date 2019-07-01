import { SET_CARDS, SET_ITEMS } from '../konstants/index'
import { Action } from 'redux'
import { Account as PlaidCard } from 'plaid'
import { DBItem } from '../sagas/sagas'
export type AccountsActionTypes = typeof SET_ITEMS | typeof SET_CARDS

// Generics
export interface AccountsAction<P> extends Action<AccountsActionTypes> {
  type: AccountsActionTypes
  payload: P
}
export type AccountsActionCreator<P> = (payload: P) => AccountsAction<P>

// Action Creators
export type SetCardsActionCreator = AccountsActionCreator<PlaidCard[]>
export const setCards: SetCardsActionCreator = cards => ({
  type: SET_CARDS,
  payload: cards,
})

export type SetItemsActionCreator = AccountsActionCreator<DBItem[]>
export const setItems: SetItemsActionCreator = items => ({
  type: SET_ITEMS,
  payload: items,
})

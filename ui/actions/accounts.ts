import {
  SET_CARDS,
  SET_ITEMS,
  FETCH_ADD_ITEM,
  TOGGLE_CARD_SELECTED,
  TOGGLE_ITEM_SELECTED,
} from '../konstants/index'
import { Action } from 'redux'
import { DBItem, PileaCard } from '../sagas/sagas'
export type AccountsActionTypes =
  | typeof SET_ITEMS
  | typeof SET_CARDS
  | typeof FETCH_ADD_ITEM
  | typeof TOGGLE_CARD_SELECTED
  | typeof TOGGLE_ITEM_SELECTED

// Generics
export interface AccountsAction<P, AT extends AccountsActionTypes>
  extends Action<AT> {
  type: AT
  payload: P
}
export type AccountsActionCreator<P, AT extends AccountsActionTypes> = (
  payload: P
) => AccountsAction<P, AT>

// Action Creators
export type FetchAddItemActionCreator = AccountsActionCreator<
  {
    accessToken: string
    alias: string
  },
  typeof FETCH_ADD_ITEM
>
export const fetchAddItem: FetchAddItemActionCreator = tokenAndAlias => ({
  type: FETCH_ADD_ITEM,
  payload: tokenAndAlias,
})

export type SetCardsActionCreator = AccountsActionCreator<
  PileaCard[],
  typeof SET_CARDS
>
export const setCards: SetCardsActionCreator = cards => ({
  type: SET_CARDS,
  payload: cards,
})

export type SetItemsActionCreator = AccountsActionCreator<
  DBItem[],
  typeof SET_ITEMS
>
export const setItems: SetItemsActionCreator = items => ({
  type: SET_ITEMS,
  payload: items,
})

export type ToggleItemSelectedActionCreator = AccountsActionCreator<
  number,
  typeof TOGGLE_ITEM_SELECTED
>
export const toggleItemSelected: ToggleItemSelectedActionCreator = itemId => ({
  payload: itemId,
  type: TOGGLE_ITEM_SELECTED,
})

export type ToggleCardSelectedActionCreator = AccountsActionCreator<
  string,
  typeof TOGGLE_CARD_SELECTED
>

export const toggleCardSelected: ToggleCardSelectedActionCreator = cardId => ({
  payload: cardId,
  type: TOGGLE_CARD_SELECTED,
})

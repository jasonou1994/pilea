import {
  ADD_CARDS,
  SET_ITEMS,
  FETCH_ADD_ITEM,
  TOGGLE_CARD_SELECTED,
  TOGGLE_ITEM_SELECTED,
  FETCH_REMOVE_ITEM,
} from '../konstants/index'
import { Action } from 'redux'
import { DBItem, PileaCard } from '../sagas/sagas'

export type AccountsActionTypes =
  | typeof SET_ITEMS
  | typeof ADD_CARDS
  | typeof FETCH_ADD_ITEM
  | typeof TOGGLE_CARD_SELECTED
  | typeof TOGGLE_ITEM_SELECTED
  | typeof FETCH_REMOVE_ITEM

export type AccountsInterfaces =
  | FetchAddItemInterface
  | addCardsInterface
  | SetItemsInterface
  | ToggleItemSelectedInterface
  | ToggleCardSelectedInterface

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
export type FetchAddItemInterface = AccountsAction<
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

export type addCardsActionCreator = AccountsActionCreator<
  PileaCard[],
  typeof ADD_CARDS
>
export type addCardsInterface = AccountsAction<PileaCard[], typeof ADD_CARDS>
export const addCards: addCardsActionCreator = cards => ({
  type: ADD_CARDS,
  payload: cards,
})

export type SetItemsActionCreator = AccountsActionCreator<
  DBItem[],
  typeof SET_ITEMS
>
export type SetItemsInterface = AccountsAction<DBItem[], typeof SET_ITEMS>
export const setItems: SetItemsActionCreator = items => ({
  type: SET_ITEMS,
  payload: items,
})

export type ToggleItemSelectedActionCreator = AccountsActionCreator<
  number,
  typeof TOGGLE_ITEM_SELECTED
>
export type ToggleItemSelectedInterface = AccountsAction<
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
export type ToggleCardSelectedInterface = AccountsAction<
  string,
  typeof TOGGLE_CARD_SELECTED
>
export const toggleCardSelected: ToggleCardSelectedActionCreator = cardId => ({
  payload: cardId,
  type: TOGGLE_CARD_SELECTED,
})

export type FetchRemoveItemActionCreator = AccountsActionCreator<
  number,
  typeof FETCH_REMOVE_ITEM
>
export type FetchRemoveItemInterface = AccountsAction<
  number,
  typeof FETCH_REMOVE_ITEM
>
export const fetchRemoveItem: FetchRemoveItemActionCreator = itemId => ({
  payload: itemId,
  type: FETCH_REMOVE_ITEM,
})

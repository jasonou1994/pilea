import React, { FunctionComponent } from 'react'
import { FetchAddItemActionCreator } from '../actions'

interface AddNewItemModalProps {
  setAlias: (alias: string) => void
  hideModal: () => void
  onClick: () => void
}

export const AddNewItemModal: FunctionComponent<AddNewItemModalProps> = ({
  setAlias,
  hideModal,
  onClick,
}) => (
  <div>
    <input
      type="text"
      placeholder="Enter a nickname for this financial institution."
      onChange={({ target: { value } }) => setAlias(value)}
    />
    <button
      onClick={() => {
        setAlias('')
        hideModal()
        onClick()
      }}
    >
      Confirm
    </button>
  </div>
)

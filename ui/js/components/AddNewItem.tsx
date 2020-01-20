import React, { FunctionComponent, useState } from 'react'
import { FetchAddItemActionCreator } from '../actions'
import { AddNewItemButton } from './AddNewItemButton'
import { AddNewItemModal } from './AddNewItemModal'

interface AddNewItemProps {
  hidden: boolean
  onConfirm: FetchAddItemActionCreator
}

export const AddNewItem: FunctionComponent<AddNewItemProps> = props => {
  const [token, setToken] = useState('')
  const [modalShown, setModalShown] = useState(false)

  return (
    <div>
      {!modalShown ? (
        <AddNewItemButton
          hidden={props.hidden}
          onSuccess={(token: string) => {
            setToken(token)
            setModalShown(true)
          }}
        />
      ) : (
        <AddNewItemModal
          {...{
            hideModal: () => setModalShown(false),
            onConfirm: (alias: string) =>
              props.onConfirm({ alias, accessToken: token }),
          }}
        />
      )}
    </div>
  )
}

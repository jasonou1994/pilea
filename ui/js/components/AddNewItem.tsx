import React, { FunctionComponent, useState } from 'react'
import { FetchAddItemActionCreator } from '../actions'
import { AddNewItemButton } from './AddNewItemButton'
import { AddNewItemModal } from './AddNewItemModal'

interface AddNewItemProps {
  hidden: boolean
  onClick: FetchAddItemActionCreator
}

export const AddNewItem: FunctionComponent<AddNewItemProps> = props => {
  const [alias, setAlias] = useState('')
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
            setAlias,
            hideModal: () => setModalShown(false),
            onClick: () => props.onClick({ accessToken: token, alias }),
          }}
        />
      )}
    </div>
  )
}

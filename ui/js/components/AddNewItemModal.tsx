import React, { FunctionComponent, useState } from 'react'
import { TextInput } from './common/TextInput'
import { Button } from './common/Button'

interface AddNewItemModalProps {
  hideModal: () => void
  onConfirm: (alias: string) => void
}

export const AddNewItemModal: FunctionComponent<AddNewItemModalProps> = ({
  hideModal,
  onConfirm,
}) => {
  const [alias, setAlias] = useState('')

  return (
    <div className="new-item-modal-container">
      <div className="new-item-modal">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ marginTop: '0px' }}>New Account</h2>
          <span
            style={{ cursor: 'pointer', marginTop: '-5px' }}
            onClick={() => {
              setAlias('')
              hideModal()
            }}
          >
            X
          </span>
        </div>
        <p>Enter an alias for this account:</p>
        <TextInput
          value={alias}
          invalid={false}
          type="text"
          placeholder="Alias"
          onChange={value => setAlias(value)}
        />
        <Button
          type="normal"
          disabled={false}
          text="Confirm"
          onClick={() => {
            setAlias('')
            hideModal()
            onConfirm(alias)
          }}
        ></Button>
      </div>
    </div>
  )
}

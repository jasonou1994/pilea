import React, { FunctionComponent } from 'react'
import PlaidLink from 'react-plaid-link'
import { PLAID_ENV, PLAID_PUBLIC_KEY } from '../konstants'

interface AddNewItemButtonProps {
  hidden: boolean
  onSuccess: (token: string) => any
}

export const AddNewItemButton: FunctionComponent<AddNewItemButtonProps> = props => {
  return !props.hidden ? (
    <PlaidLink
      clientName="Pilea"
      env={PLAID_ENV}
      product={['transactions']}
      publicKey={PLAID_PUBLIC_KEY}
      onSuccess={props.onSuccess}
      className="button"
      style={{ marginTop: '-10px' }}
    >
      Add Institution
    </PlaidLink>
  ) : (
    <div>Please confirm account to add institutions. Check your email!</div>
  )
}

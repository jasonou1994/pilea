import React, { FunctionComponent } from 'react'
import PlaidLink from 'react-plaid-link'
import { PLAID_PUBLIC_KEY } from '../konstants'

interface AddNewItemButtonProps {
  hidden: boolean
  onSuccess: (token: string) => any
}

export const AddNewItemButton: FunctionComponent<AddNewItemButtonProps> = props => {
  return !props.hidden ? (
    <PlaidLink
      clientName="Pilea"
      env={'development'}
      product={['transactions']}
      publicKey={PLAID_PUBLIC_KEY}
      onSuccess={props.onSuccess}
      className="button button-primary"
      style={{}}
    >
      Add Institution
    </PlaidLink>
  ) : (
    <div>Please confirm account to add institutions. Check your email!</div>
  )
}

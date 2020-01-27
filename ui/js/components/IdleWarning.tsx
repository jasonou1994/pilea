import React, { FunctionComponent } from 'react'
import { Button } from './common/Button'

interface IdleWarningProps {
  onLogOutClick: () => void
  onRemainClick: () => void
}

export const IdleWarning: FunctionComponent<IdleWarningProps> = ({
  onLogOutClick,
  onRemainClick,
}) => {
  return (
    <div>
      <div>
        You've been idle for a while. We'll log you out automatically soon to
        keep your data safe
      </div>
      <div>
        <Button
          {...{
            type: 'normal',
            disabled: false,
            text: 'Stay Logged In',
            onClick: onRemainClick,
          }}
        />
        <Button
          {...{
            type: 'normal',
            disabled: false,
            text: 'Log Out',
            onClick: onLogOutClick,
          }}
        />
      </div>
    </div>
  )
}

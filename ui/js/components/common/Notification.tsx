import React, { FunctionComponent } from 'react'
import classNames from 'classnames'

export interface Notification {
  id: string
  success: boolean
  title: string
  message: string
  dismissed?: boolean
}

interface NotificationProps {
  notification: Notification
  handleDismiss: (id: string) => void
}

export const Notification: FunctionComponent<NotificationProps> = ({
  notification: { success, message, id, title },
  handleDismiss,
}) => (
  <div
    className={classNames(
      'notification',
      {
        'notification-success': success,
      },
      {
        'notification-failure': !success,
      }
    )}
  >
    <div className="header">
      <div className="title">{title}</div>
      <div className="dismiss-notification" onClick={() => handleDismiss(id)}>
        x
      </div>
    </div>

    {message}
  </div>
)

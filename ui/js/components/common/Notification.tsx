import classNames from 'classnames'
import React, { FunctionComponent } from 'react'

export interface Notification {
  dismissed?: boolean
  id: string
  message: string
  success: boolean
  title: string
}

interface NotificationProps {
  handleDismiss: (id: string) => void
  notification: Notification
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

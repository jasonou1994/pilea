import React, { FunctionComponent, useEffect, useState } from 'react'
import { Notification } from './Notification'
import { useInterval } from '../../utilities/utils'

export const PERSISTENT = 'persistent'
export const TEMPORARY = 'temporary'
export type NotificationDurationType = typeof PERSISTENT | typeof TEMPORARY

export interface NotificationWithDuration extends Notification {
  timeCreated: number
  durationInSeconds?: number
  durationType: NotificationDurationType
}

interface NotificationsContainerProps {
  notifications: NotificationWithDuration[]
  onExpireHandler?: (notifications: NotificationWithDuration[]) => any
}

const processNotifications: (
  notifs: NotificationWithDuration[]
) => {
  active: NotificationWithDuration[]
  expired: NotificationWithDuration[]
} = notifs => {
  const now = Date.now()

  return notifs.reduce(
    (acc, cur) => {
      const expiryTime = cur.timeCreated + cur.durationInSeconds * 1000

      if (cur.durationType === 'temporary' && now >= expiryTime) {
        acc.expired.push(cur)
      } else {
        acc.active.push(cur)
      }

      return acc
    },
    {
      active: [],
      expired: [],
    }
  )
}

export const NotificationsContainer: FunctionComponent<
  NotificationsContainerProps
> = ({ notifications, onExpireHandler }) => {
  const [expiredNotifs, setExpiredNotifs] = useState<
    NotificationWithDuration[]
  >([])
  const [activeNotifs, setActiveNotifs] = useState<NotificationWithDuration[]>(
    []
  )

  useEffect(() => {
    const { active, expired } = processNotifications(notifications)
    setActiveNotifs(active)
    setExpiredNotifs(expired)
  }, [])

  // Every second, update the expiry key and call callback for all expired notifications
  useInterval(() => {
    const { active, expired } = processNotifications(activeNotifs)
    const allExpiredNotifs = [...expired, ...expiredNotifs]

    setActiveNotifs(active)
    setExpiredNotifs(allExpiredNotifs)

    if (allExpiredNotifs.length > 0) {
      onExpireHandler(allExpiredNotifs)
    }
  }, 1500)

  const handleDismiss: (id: string) => void = id => {
    const newActive = activeNotifs.filter(
      notification => notification.id !== id
    )
    const newExpired = [
      ...expiredNotifs,
      activeNotifs.find(notification => notification.id === id),
    ]

    setActiveNotifs(newActive)
    setExpiredNotifs(newExpired)
  }

  return (
    <div className="notification-container">
      {activeNotifs.map((notif, i) => (
        <Notification
          notification={notif}
          key={i}
          handleDismiss={handleDismiss}
        />
      ))}
    </div>
  )
}

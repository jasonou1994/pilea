import { Action } from 'redux'
import { NotificationWithDuration } from '../components/common/NotificationsContainer'
import { ADD_ACTIVE_NOTIFICATIONS, EXPIRE_NOTIFICATIONS } from '../konstants'

type NotificationActionTypes =
  | typeof ADD_ACTIVE_NOTIFICATIONS
  | typeof EXPIRE_NOTIFICATIONS

export type NotificationActions =
  | AddActiveNotificationsAction
  | ExpireNotificationsAction

// Generics
export interface NotificationsAction<P, AT extends NotificationActionTypes>
  extends Action<AT> {
  type: AT
  payload: P
}

export type NotificationsActionCreator<
  P,
  AT extends NotificationActionTypes
> = (payload: P) => NotificationsAction<P, AT>

// Actions
export type AddActiveNotificationsActionCreator = NotificationsActionCreator<
  {
    notifications: NotificationWithDuration[]
  },
  typeof ADD_ACTIVE_NOTIFICATIONS
>
export type AddActiveNotificationsAction = NotificationsAction<
  {
    notifications: NotificationWithDuration[]
  },
  typeof ADD_ACTIVE_NOTIFICATIONS
>
export const addActiveNotifications: AddActiveNotificationsActionCreator = ({
  notifications,
}) => ({ payload: { notifications }, type: ADD_ACTIVE_NOTIFICATIONS })

export type ExpireNotificationsActionCreator = NotificationsActionCreator<
  {
    notifications: NotificationWithDuration[]
  },
  typeof EXPIRE_NOTIFICATIONS
>
export type ExpireNotificationsAction = NotificationsAction<
  {
    notifications: NotificationWithDuration[]
  },
  typeof EXPIRE_NOTIFICATIONS
>
export const expireNotifications: ExpireNotificationsActionCreator = ({
  notifications,
}) => ({ payload: { notifications }, type: EXPIRE_NOTIFICATIONS })

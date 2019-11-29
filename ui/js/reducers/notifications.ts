import {
  ACTIVE_NOTIFICATIONS,
  EXPIRED_NOTIFICATIONS,
  ADD_ACTIVE_NOTIFICATIONS,
  EXPIRE_NOTIFICATIONS,
  NOTIFICATIONS,
} from '../konstants/index'
import { setIn, update } from 'timm'
import { NotificationActions } from '../actions'
import { NotificationWithDuration } from '../components/NotificationsContainer'
import { RootState } from '.'

export interface NotificationsState {
  [ACTIVE_NOTIFICATIONS]: NotificationWithDuration[]
  [EXPIRED_NOTIFICATIONS]: NotificationWithDuration[]
}

const initialState: NotificationsState = {
  [ACTIVE_NOTIFICATIONS]: [],
  [EXPIRED_NOTIFICATIONS]: [],
}

const notifications: (
  state: NotificationsState,
  action: NotificationActions
) => NotificationsState = (state = initialState, action) => {
  let newState: NotificationsState

  switch (action.type) {
    case ADD_ACTIVE_NOTIFICATIONS: {
      newState = update(state, ACTIVE_NOTIFICATIONS, prevActiveNotifs => [
        ...prevActiveNotifs,
        action.payload.notification,
      ])

      break
    }
    case EXPIRE_NOTIFICATIONS: {
      const newActiveNotifs = state[ACTIVE_NOTIFICATIONS].filter(activeNotif =>
        action.payload.notifications.reduce((acc, expiredNotif) => {
          if (expiredNotif.id === activeNotif.id) {
            acc = false
          }
          return acc
        }, true as boolean)
      )
      const newExpiredNotifs = [
        ...state[EXPIRED_NOTIFICATIONS],
        ...action.payload.notifications,
      ]

      newState = setIn(state, [ACTIVE_NOTIFICATIONS], newActiveNotifs)
      newState = setIn(newState, [EXPIRED_NOTIFICATIONS], newExpiredNotifs)

      break
    }
    default: {
      newState = state
    }
  }

  return newState
}
export default notifications

export const activeNotificationsSelector = (state: RootState) => {
  return state[NOTIFICATIONS][ACTIVE_NOTIFICATIONS]
}
export const expiredNotificationsSelector = (state: RootState) => {
  return state[NOTIFICATIONS][EXPIRED_NOTIFICATIONS]
}

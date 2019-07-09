import { dbClient } from '../database'
import { ITEMS } from '../constants'
import moment from 'moment'

export interface DBItem {
  id?: number
  userId: number
  accessToken: string
  lastUpdated?: string
  alias?: string
}

export const getItems: ({ userId }) => Promise<DBItem[]> = async ({ userId }) =>
  await new Promise((resolve, reject) => {
    dbClient
      .select('*')
      .from(ITEMS)
      .where({ userId })
      .then(rows => resolve(rows))
      .catch(err => reject(err))
  })

export const insertItem: ({
  userId,
  accessToken,
  alias,
}: DBItem) => Promise<void> = async ({ userId, accessToken, alias }) => {
  await dbClient(ITEMS).insert({
    userId,
    accessToken,
    alias,
    lastUpdated: moment(),
  })
}

export const updateItemById: ({ id }) => Promise<void> = async ({ id }) => {
  await dbClient(ITEMS)
    .update({
      lastUpdated: moment(),
    })
    .where({ id })
}

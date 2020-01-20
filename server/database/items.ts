import moment from 'moment'
import { ITEMS } from '../constants'
import { dbClient } from '../database'

export interface DBItem {
  accessToken: string
  alias?: string
  id?: number
  lastUpdated?: string
  userId: number
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

export const deleteItem: ({
  userId,
  itemId,
}: {
  itemId: number
  userId: number
}) => Promise<void> = async ({ userId, itemId }) =>
  await dbClient(ITEMS)
    .where({ userId, id: itemId })
    .del()

export const updateItemById: ({ id }) => Promise<void> = async ({ id }) => {
  await dbClient(ITEMS)
    .update({
      lastUpdated: moment(),
    })
    .where({ id })
}

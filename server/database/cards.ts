import { dbClient } from '../database'
import { CARDS, USERS, TRANSACTIONS } from '../constants'
import { Account as PlaidCard } from 'plaid'

export interface DBCard {
  account_id: string
  userId: number
  itemId: number
  mask: string | null
  name: string | null
  official_name: string | null
  subtype: string | null
  type: string | null
  available: number | null
  current: number | null
  credit_limit: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
}

export interface PileaCard extends PlaidCard {
  userId: number
  itemId: number
}

export const getCards: ({
  userId,
  itemId,
}: {
  userId: number
  itemId?: number
}) => Promise<PileaCard[]> = async ({ userId, itemId }) => {
  const dbCards: DBCard[] = await dbClient
    .select('*')
    .from(CARDS)
    .where({
      userId,
      ...(itemId ? { itemId } : {}),
    })

  const pileaCards: PileaCard[] = dbCards.map(dbCard => {
    const {
      available,
      current,
      credit_limit,
      iso_currency_code,
      official_currency_code,
      ...sharedFields
    } = dbCard

    return {
      ...sharedFields,
      verification_status: null,

      balances: {
        available,
        current,
        limit: credit_limit,
        iso_currency_code,
        official_currency_code,
        unofficial_currency_code: null,
      },
    }
  })

  return pileaCards
}

export const deleteCards: ({
  userId,
  itemId,
}: {
  userId: number
  itemId?: number
}) => Promise<void> = async ({ userId, itemId }) => {
  await dbClient(CARDS)
    .where({ userId, ...(itemId ? { itemId } : {}) })
    .del()
}

export const insertCards: (cards: DBCard[]) => Promise<void> = async cards =>
  await dbClient(CARDS).insert(cards)

export const dbDailySumByCard: (
  userId: number
) => Promise<
  Array<{
    name: string
    type: 'depository' | 'credit'
    sum: number
    date: string
  }>
> = async userId =>
  (
    await dbClient
      .select('cards.name', 'official_name', 'type', 'date')
      .sum('amount')
      .from(TRANSACTIONS)
      .innerJoin(CARDS, 'transactions.account_id', 'cards.account_id')
      .where({ 'transactions.userId': userId })
      .groupBy('cards.name', 'official_name', 'type', 'date')
      .orderBy('date', 'asc')
      .debug(true)
  ).map(({ name, official_name, type, date, sum }) => ({
    name: official_name ? official_name : name,
    sum,
    type,
    date,
  }))

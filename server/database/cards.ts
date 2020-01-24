import { Account as PlaidCard } from 'plaid'
import { CARDS, TRANSACTIONS, USERS } from '../constants'
import { getDbClient } from '../database'

export interface DBCard {
  account_id: string
  available: number | null
  credit_limit: number | null
  current: number | null
  iso_currency_code: string | null
  itemId: number
  mask: string | null
  name: string | null
  official_currency_code: string | null
  official_name: string | null
  subtype: string | null
  type: string | null
  userId: number
}

export interface PileaCard extends PlaidCard {
  itemId: number
  userId: number
}

export const getCards: ({
  userId,
  itemId,
}: {
  itemId?: number
  userId: number
}) => Promise<PileaCard[]> = async ({ userId, itemId }) => {
  const dbCards: DBCard[] = await getDbClient()
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
  itemId?: number
  userId: number
}) => Promise<void> = async ({ userId, itemId }) => {
  await getDbClient()(CARDS)
    .where({ userId, ...(itemId ? { itemId } : {}) })
    .del()
}

export const insertCards: (cards: DBCard[]) => Promise<void> = async cards =>
  await getDbClient()(CARDS).insert(cards)

export const dbDailySumByCard: (
  userId: number
) => Promise<
  Array<{
    date: string
    id: string
    sum: number
    type: 'depository' | 'credit'
  }>
> = async userId =>
  (
    await getDbClient()
      .select('cards.account_id', 'type', 'date')
      .sum('amount')
      .from(TRANSACTIONS)
      .innerJoin(CARDS, 'transactions.account_id', 'cards.account_id')
      .where({ 'transactions.userId': userId })
      .groupBy('cards.account_id', 'type', 'date')
      .orderBy('date', 'asc')
      .debug(true)
  ).map(({ account_id, type, date, sum }) => ({
    id: account_id,
    sum,
    type,
    date,
  }))

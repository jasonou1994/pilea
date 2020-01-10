import { dbClient } from '../database'
import { TRANSACTIONS } from '../constants'
import {
  Iso8601DateString,
  Transaction as PlaidTransaction,
  TransactionsResponse,
} from 'plaid'

export interface DBTransaction {
  account_id: string
  account_owner: string | null
  amount: number | null
  iso_currency_code: string | null
  category: Array<string> | null
  category_id: string | null
  date: Iso8601DateString
  name: string | null
  pending: boolean | null
  pending_transaction_id: string | null
  transaction_id: string
  transaction_type: string | null
  userId: number
  address: string | null
  city: string | null
  lat: number | null
  lon: number | null
  store_number: string | null
  by_order_of: string | null
  payee: string | null
  payer: string | null
  payment_method: string | null
  payment_processor: string | null
  ppd_id: string | null
  reason: string | null
  reference_number: string | null
}

export const getTransactions: ({
  userId,
}) => Promise<PlaidTransaction[]> = async ({ userId }) => {
  const dbTransactions: DBTransaction[] = await dbClient
    .select('*')
    .from(TRANSACTIONS)
    .where({ userId })

  return dbTransactions.map(tx => {
    const {
      userId: _,
      address,
      city,
      lat,
      lon,
      store_number,
      by_order_of,
      payee,
      payer,
      payment_method,
      payment_processor,
      ppd_id,
      reason,
      reference_number,
      ...sharedFields
    } = tx

    return {
      ...sharedFields,
      location: {
        address,
        city,
        lat,
        lon,
        store_number,
        region: null,
        postal_code: null,
        country: null,
      },
      payment_meta: {
        by_order_of,
        payee,
        payer,
        payment_method,
        payment_processor,
        ppd_id,
        reason,
        reference_number,
      },
    } as PlaidTransaction
  })
}

export const deleteTransactions: ({ userId }) => Promise<void> = async ({
  userId,
}) => {
  await dbClient(TRANSACTIONS)
    .where({ userId })
    .del()
}
export const deleteTransactionsForGivenCardAndUser: ({
  userId,
  cardId,
}: {
  userId: number
  cardId: string
}) => Promise<void> = async ({ userId, cardId }) =>
  await dbClient(TRANSACTIONS)
    .where({ userId, account_id: cardId })
    .del()

export const insertTransactions: ({
  plaidTransactions,
  userId,
}: {
  plaidTransactions: PlaidTransaction[]
  userId: number
}) => Promise<void> = async ({ plaidTransactions, userId }) => {
  const dbTransactions: DBTransaction[] = plaidTransactions.map(plaidTx => {
    const {
      location: { address, city, lat, lon, store_number },
      payment_meta: {
        by_order_of,
        payee,
        payer,
        payment_method,
        payment_processor,
        ppd_id,
        reason,
        reference_number,
      },
      // Plaid API is not accurate...these are extra fields.
      // @ts-ignore
      authorized_date,
      // @ts-ignore
      payment_channel,
      ...sharedFields
    } = plaidTx

    return {
      ...sharedFields,
      userId,
      address,
      city,
      lat,
      lon,
      store_number,
      by_order_of,
      payee,
      payer,
      payment_method,
      payment_processor,
      ppd_id,
      reason,
      reference_number,
    }
  })

  await dbClient(TRANSACTIONS).insert(dbTransactions)
  // .debug(true)
}

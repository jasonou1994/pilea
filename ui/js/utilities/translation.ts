import { RawTransaction } from '../sagas/sagas'
import { Transaction as PlaidTransaction } from 'plaid'

export const parseRawTransaction: (
  rawTxs: RawTransaction[]
) => PlaidTransaction[] = rawTxs =>
  rawTxs.map(tx => ({
    ...tx,
    category: tx.category
      ? typeof tx.category === 'string'
        ? tx.category
            .replace(/[{|}|"]/g, '')
            .trim()
            .split(',')
        : tx.category
      : [],
  }))

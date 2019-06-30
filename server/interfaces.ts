import {
  Iso8601DateString,
  Transaction as PlaidTransaction,
  Account as PlaidCard,
} from 'plaid'
import { DBTransaction } from './database/transactions'
import { DBItem } from './database/items'

//items
export interface Account {
  id: number
  lastUpdated: string
  alias: string
}

//users

//transactions

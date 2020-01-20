import {
  Account as PlaidCard,
  Iso8601DateString,
  Transaction as PlaidTransaction,
} from 'plaid'
import { DBItem } from './database/items'
import { DBTransaction } from './database/transactions'

//items
export interface Account {
  alias: string
  id: number
  lastUpdated: string
}

//users

//transactions

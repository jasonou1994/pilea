import { Router } from 'express'
import {
  checkUpdateAuthToken,
  getHistoricalBalanceByCard,
  getTransactionCount,
  getUserId,
  refreshTransactions,
  retrieveTransactions,
} from '../middleware'

export const transactions = Router()

transactions.post(
  '/refresh',
  checkUpdateAuthToken,
  getUserId,
  refreshTransactions,
  retrieveTransactions
)

transactions.post(
  '/retrieve',
  checkUpdateAuthToken,
  getUserId,
  retrieveTransactions
)

transactions.get(
  '/historical',
  checkUpdateAuthToken,
  getUserId,
  getHistoricalBalanceByCard
)

transactions.get('/count', checkUpdateAuthToken, getUserId, getTransactionCount)

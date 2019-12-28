import { Router } from 'express'
import {
  refreshTransactions,
  checkUpdateAuthToken,
  getUserId,
  retrieveTransactions,
  getHistoricalBalanceByCard,
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

transactions.post(
  '/historical',
  checkUpdateAuthToken,
  getUserId,
  getHistoricalBalanceByCard
)

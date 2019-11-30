import { Router } from 'express'
import {
  refreshTransactions,
  checkUpdateAuthToken,
  getUserId,
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

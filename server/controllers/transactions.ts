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
  (_, __, next) => {
    console.log('In /transactions/retrieve')
    next()
  },
  checkUpdateAuthToken,
  getUserId,
  retrieveTransactions
)

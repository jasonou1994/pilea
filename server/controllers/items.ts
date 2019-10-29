import { Router } from 'express'
import {
  addItem,
  checkUpdateAuthToken,
  getUserId,
  getAllItems,
  removeItem,
  sendEmptyResponse,
  retrieveTransactions,
  refreshTransactionsSSE,
  checkIfVerifiedAccount,
} from '../middleware'

export const items = Router()

items.post(
  '/add',
  checkUpdateAuthToken,
  getUserId,
  checkIfVerifiedAccount,
  addItem,
  refreshTransactionsSSE,
  retrieveTransactions
)
items.post(
  '/delete',
  checkUpdateAuthToken,
  getUserId,
  checkIfVerifiedAccount,
  removeItem,
  retrieveTransactions
)

items.get('/', checkUpdateAuthToken, getUserId, getAllItems)

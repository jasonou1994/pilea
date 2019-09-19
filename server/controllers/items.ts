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
} from '../middleware'

export const items = Router()

items.post(
  '/add',
  checkUpdateAuthToken,
  getUserId,
  addItem,
  refreshTransactionsSSE,
  retrieveTransactions
)
items.post(
  '/delete',
  checkUpdateAuthToken,
  getUserId,
  removeItem,
  retrieveTransactions
)

items.get('/', checkUpdateAuthToken, getUserId, getAllItems)

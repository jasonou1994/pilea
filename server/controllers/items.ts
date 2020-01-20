import { Router } from 'express'
import {
  addItem,
  checkIfVerifiedAccount,
  checkUpdateAuthToken,
  getAllItems,
  getUserId,
  refreshTransactions,
  removeItem,
  retrieveTransactions,
  sendEmptyResponse,
} from '../middleware'

export const items = Router()

items.post(
  '/add',
  checkUpdateAuthToken,
  getUserId,
  checkIfVerifiedAccount,
  addItem,
  refreshTransactions,
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

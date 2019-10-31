import { Router } from 'express'
import {
  addItem,
  checkUpdateAuthToken,
  getUserId,
  getAllItems,
  removeItem,
  sendEmptyResponse,
  retrieveTransactions,
  refreshTransactions,
  checkIfVerifiedAccount,
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

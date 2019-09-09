import { Router } from 'express'
import {
  addItem,
  checkUpdateAuthToken,
  getUserId,
  getAllItems,
  removeItem,
  sendEmptyResponse,
} from '../middleware'

export const items = Router()

items.post('/add', checkUpdateAuthToken, getUserId, addItem)
items.post(
  '/delete',
  checkUpdateAuthToken,
  getUserId,
  removeItem,
  sendEmptyResponse
)

items.get('/', checkUpdateAuthToken, getUserId, getAllItems)

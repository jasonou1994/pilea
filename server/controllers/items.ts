import { Router } from 'express'
import {
  addItem,
  checkUpdateAuthToken,
  getUserId,
  getAllItems,
} from '../middleware'

export const items = Router()

items.post('/add', checkUpdateAuthToken, getUserId, addItem)

items.get('/', checkUpdateAuthToken, getUserId, getAllItems)

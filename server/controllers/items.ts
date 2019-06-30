import { Router } from 'express'
import { addItem, checkUpdateAuthToken, getUserId } from '../middleware'

export const items = Router()

items.post('/add', checkUpdateAuthToken, getUserId, addItem)

import { Request, Response } from 'express'
import { dbClient } from '../database'
import { ITEMS, client } from '../constants'
import { plaidGetAccessToken } from '../plaidAPI'
import { insertItem, getItems, DBItem } from '../database/items'
import { ContractResponse } from '.'

export interface ContractItemAdd extends ContractResponse {
  items: DBItem[]
}

export const addItem = async (req: Request, res: Response) => {
  const { userId } = res.locals
  const { alias, publicToken } = req.body
  console.log(publicToken, alias)
  try {
    const accessToken = await plaidGetAccessToken({ public_token: publicToken })
    await insertItem({ userId, accessToken, alias })

    const items = await getItems({ userId })

    const resBody = {
      success: true,
      status: 'Successfully added item',
      items,
    } as ContractItemAdd

    res.json(resBody)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      status: 'Failed to add item.',
      error,
    } as ContractItemAdd)
  }
}

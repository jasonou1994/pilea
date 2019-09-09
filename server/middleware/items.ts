import { Request, Response, NextFunction } from 'express'
import { plaidGetAccessToken } from '../plaidAPI'
import { insertItem, getItems, DBItem, deleteItem } from '../database/items'
import { ContractResponse } from '.'
import { PileaCard, getCards, deleteCards } from '../database/cards'
import { deleteTransactionsForGivenCardAndUser } from '../database/transactions'

export interface ContractItemAdd extends ContractResponse {
  items: DBItem[]
}

export interface ContractItemGet extends ContractItemAdd {}

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

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = res.locals
    const { itemId } = req.body

    const cards: PileaCard[] = await getCards({ userId, itemId })
    const deletions: Promise<void>[] = [
      ...cards.map(
        async card =>
          await deleteTransactionsForGivenCardAndUser({
            userId,
            cardId: card.account_id,
          })
      ),
      deleteCards({ userId, itemId }),
      deleteItem({ userId, itemId }),
    ]
    await Promise.all(deletions)

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

export const getAllItems = async (_: Request, res: Response) => {
  try {
    const { userId } = res.locals

    const items = await getItems({ userId })

    const resBody: ContractItemGet = {
      items,
      status: 'Successfully retrieved items.',
      success: true,
    } as ContractItemGet

    res.json(resBody)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      status: 'Failed to add item.',
      error,
    } as ContractItemGet)
  }
}

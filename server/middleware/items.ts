import { Request, Response, NextFunction } from 'express'
import { plaidGetAccessToken } from '../plaidAPI'
import { insertItem, getItems, DBItem, deleteItem } from '../database/items'
import { ContractResponse, generateGenericErrorResponse } from '.'
import { PileaCard, getCards, deleteCards } from '../database/cards'
import { deleteTransactionsForGivenCardAndUser } from '../database/transactions'
import { logger } from '../logger'

export interface ContractItemAdd extends ContractResponse {
  items: DBItem[]
}

export interface ContractItemGet extends ContractItemAdd {}

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In addItem middleware.')
  const { userId } = res.locals
  const { alias, publicToken } = req.body
  try {
    const accessToken = await plaidGetAccessToken({ public_token: publicToken })
    await insertItem({ userId, accessToken, alias })

    next()
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const removeItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In removeItem middleware.')

  try {
    const { userId } = res.locals
    const { itemId } = req.body

    const cards: PileaCard[] = await getCards({ userId, itemId })
    const deletions: Promise<void>[] = cards.map(
      async card =>
        await deleteTransactionsForGivenCardAndUser({
          userId,
          cardId: card.account_id,
        })
    )

    await Promise.all(deletions)
    await deleteCards({ userId, itemId })
    await deleteItem({ userId, itemId })

    next()
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

export const getAllItems = async (_: Request, res: Response) => {
  try {
    logger.info('In getAllItems middleware.')

    const { userId } = res.locals

    const items = await getItems({ userId })

    const resBody: ContractItemGet = {
      items,
      status: 'Successfully retrieved items.',
      success: true,
    } as ContractItemGet

    res.json(resBody)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

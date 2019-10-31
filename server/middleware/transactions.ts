import { Request, Response, NextFunction } from 'express'
import {
  TransactionsResponse,
  Account as PlaidCard,
  Transaction as PlaidTransaction,
} from 'plaid'
import {
  deleteTransactions,
  insertTransactions,
  getTransactions,
} from '../database/transactions'
import { DBItem, getItems, updateItemById } from '../database/items'
import { plaidGetTransactions } from '../plaidAPI'
import { deleteCards, insertCards, getCards, DBCard } from '../database/cards'
import { ContractResponse, generateGenericErrorResponse } from '.'
import { convertPlaidCardsToDBCards } from '../utils'
import { logger } from '../logger'

export interface ContractRetrieveTransactions extends ContractResponse {
  cards: PlaidCard[]
  transactions: PlaidTransaction[]
  items: DBItem[]
}

export const refreshTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug('In refreshTransactions middlware.')
  const { start, end } = req.body
  const { userId } = res.locals

  try {
    await deleteTransactions({ userId })
    await deleteCards({ userId })

    const items: DBItem[] = await getItems({ userId })

    const tokenProms = items.map(item => {
      const { accessToken: token, id: itemId } = item

      return new Promise<{
        transactions: PlaidTransaction[]
        cards: PlaidCard[]
        itemId: number
      }>(async (tokenResolve, tokenReject) => {
        // One promise for each item. Each item can fail up to 3 times before it rejects.
        const maxError = 3
        let errorCount = 0

        let completed = false
        const txCount = 500
        let txOffset = 0

        let transactionsResult: PlaidTransaction[] = []
        let cardsResult: { [key: string]: PlaidCard } = {}

        // For a given item, must retrieve transactions 500 at a time as we don't know the total number of transactions in the last 2 years
        while (!completed && errorCount < maxError) {
          const options = {
            count: txCount,
            offset: txOffset,
          }

          try {
            const {
              transactions,
              accounts,
            }: TransactionsResponse = await plaidGetTransactions({
              token,
              start,
              end,
              options,
            })

            transactionsResult = transactionsResult.concat(transactions)
            accounts.forEach(card => {
              if (!cardsResult[card.account_id]) {
                cardsResult[card.account_id] = card
              }
            })

            if (transactions.length === 0) {
              completed = true
            }

            logger.debug(
              `${transactions.length} transactions processed for item: ${
                item.alias ? item.alias : item.accessToken
              }`
            )

            txOffset += txCount
          } catch (err) {
            logger.error(
              `Error ${errorCount} in processing transactions for item ${
                item.alias ? item.alias : item.accessToken
              }: ${err}`
            )
            errorCount++
          }
        }
        //update date
        await updateItemById({ id: itemId })

        await insertTransactions({
          plaidTransactions: transactionsResult,
          userId,
        })
        await insertCards(
          convertPlaidCardsToDBCards(Object.values(cardsResult), userId, itemId)
        )

        errorCount < maxError
          ? tokenResolve({
              transactions: transactionsResult,
              cards: Object.values(cardsResult),
              itemId,
            })
          : tokenReject({
              error: `Error count exceeded limit of ${maxError} for item ${
                item.alias ? item.alias : item.accessToken
              }`,
            })
      })
    })

    await Promise.all(tokenProms)

    // One DB insertion for all transactions, One DB insertion each per item for cards...can be refactored

    logger.info(
      `Transactions successfully processed for user ${userId} for items ${items.map(
        item => (item.alias ? item.alias : item.accessToken)
      )}`
    )

    next()
  } catch (error) {
    logger.error(`Transactions refresh failure for user ${userId}`, error)
    res.status(500).json({
      status: 'Failed to refresh transactions',
      success: false,
      error,
    })
  }
}

export const retrieveTransactions = async (_: Request, res: Response) => {
  const { userId } = res.locals

  logger.debug('In retrieveTransactions middlware.')

  try {
    const [cards, transactions, items] = await Promise.all([
      await getCards({ userId }),
      await getTransactions({
        userId,
      }),
      await getItems({ userId }),
    ])

    const resBody: ContractRetrieveTransactions = {
      status: 'Successfully retrieved transactions',
      success: true,
      error: null,
      cards,
      transactions,
      items,
    }

    res.json(resBody)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
}

import { Request, Response } from 'express'
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
import { deleteCards, insertCards, getCards } from '../database/cards'
import { ContractResponse } from '.'

export interface ContractRetrieveTransactions extends ContractResponse {
  cards: PlaidCard[]
  transactions: PlaidTransaction[]
  items: DBItem[]
}

export const refreshTransactionsSSE = async (req: Request, res: Response) => {
  console.log('In /transactions/sse POST endpoint.')
  const { start, end } = req.body
  const { userId } = res.locals

  res.header('Content-Type', 'text/event-stream')
  res.header('Cache-Control', 'no-cache')
  res.header('Connection', 'keep-alive')

  await deleteTransactions({ userId })

  const items: DBItem[] = await getItems({ userId })

  const tokenProms = items.map(item => {
    const { accessToken: token, id: itemId } = item

    return new Promise(async (tokenResolve, tokenReject) => {
      const maxError = 3
      let errorCount = 0

      let completed = false
      const txCount = 500
      let txOffset = 0

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

          if (transactions.length !== 0) {
            await insertTransactions({
              plaidTransactions: transactions,
              userId,
            })

            res.write('event: transactions\n')
            res.write(`data: ${JSON.stringify(transactions)}\n\n`)

            txOffset += txCount
          } else {
            completed = true
          }

          if (accounts.length !== 0) {
            await deleteCards({ userId, itemId })
            await insertCards({ cards: accounts, userId, itemId })

            res.write('event: cards\n')
            res.write(`data: ${JSON.stringify(accounts)}\n\n`)
          }

          console.log(
            `${transactions.length} transactions processed for token: ${token}`
          )
        } catch (err) {
          console.log('ERROR', err)
          errorCount++
        }
      }
      await updateItemById({ id: itemId })

      errorCount < maxError ? tokenResolve() : tokenReject()
    })
  })

  Promise.all(tokenProms)
    .then(() => {
      console.log('tx succeed')
      res.write('id: CLOSE\n')
      res.write('event: success\n\n')
      res.end()
    })
    .catch(() => {
      console.log('tx fail')
      res.write('id: CLOSE\n')
      res.write('event: error\n\n')
      res.end()
    })
}

export const retrieveTransactions = async (_: Request, res: Response) => {
  const { userId } = res.locals

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
    res.status(500).json({
      status: 'Failed to retrieved transactions',
      success: false,
      error,
    } as ContractRetrieveTransactions)
  }
}

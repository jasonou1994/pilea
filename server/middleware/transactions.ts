import { NextFunction, Request, Response } from 'express'
import moment from 'moment'
import {
  Account as PlaidCard,
  Transaction as PlaidTransaction,
  TransactionsResponse,
} from 'plaid'
import { ContractResponse, generateGenericErrorResponse } from '.'
import {
  DBCard,
  dbDailySumByCard,
  deleteCards,
  getCards,
  insertCards,
} from '../database/cards'
import { DBItem, getItems, updateItemById } from '../database/items'
import {
  dbGetTransactionCount,
  deleteTransactions,
  getTransactions,
  insertTransactions,
} from '../database/transactions'
import { updateUserTransactionLoadingCount } from '../database/users'
import { logger } from '../logger'
import { plaidGetTransactions } from '../plaidAPI'
import { add, convertPlaidCardsToDBCards, subtract } from '../utils'

export interface ContractRetrieveTransactions extends ContractResponse {
  cards: PlaidCard[]
  items: DBItem[]
  transactions: PlaidTransaction[]
}

export interface ContractTransactionsCount extends ContractResponse {
  count: number
}

export interface ContractRetrieveHistoricalBalance extends ContractResponse {
  historicalBalances: HistoricalBalances
}

interface DailyBalances {
  [name: string]: number
}
interface DailyBalancesWithDate {
  balances: DailyBalances
  date: string
}
interface HistoricalBalances {
  [date: string]: DailyBalances
}

export const getTransactionCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.debug('In getTransactionCount middlware.')
    const { userId } = res.locals

    const count = await dbGetTransactionCount({ userId })

    const resBody: ContractTransactionsCount = {
      status: 'Successfully retrieved transaction count',
      success: true,
      error: null,
      count,
    }

    res.json(resBody)
  } catch (error) {
    logger.error(error)
    res.status(500).json(generateGenericErrorResponse(error))
  }
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
    await updateUserTransactionLoadingCount(0, userId)
    await deleteTransactions({ userId })
    await deleteCards({ userId })

    const items: DBItem[] = await getItems({ userId })

    const tokenProms = items.map(item => {
      const { accessToken: token, id: itemId } = item

      let processedTxsCount = 0

      return new Promise<{
        cards: DBCard[]
        itemId: number
        transactions: PlaidTransaction[]
      }>(async (tokenResolve, tokenReject) => {
        // One promise for each item. Each item can fail up to 3 times before it rejects.
        const maxError = 3
        let errorCount = 0

        let completed = false
        const txCount = 500
        let txOffset = 0

        let transactionsResult: PlaidTransaction[] = []
        const cardsResult: { [key: string]: PlaidCard } = {}

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

            processedTxsCount += transactions.length

            updateUserTransactionLoadingCount(processedTxsCount, userId)

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

        const dbCards = convertPlaidCardsToDBCards(
          Object.values(cardsResult),
          userId,
          itemId
        )

        errorCount < maxError
          ? tokenResolve({
              transactions: transactionsResult,
              cards: dbCards,
              itemId,
            })
          : tokenReject({
              error: `Error count exceeded limit of ${maxError} for item ${
                item.alias ? item.alias : item.accessToken
              }`,
            })
      })
    })

    const combinedResult = await Promise.all(tokenProms)

    // UNSURE WHY THIS DOES NOT WORK
    // await insertTransactions({
    //   plaidTransactions: combinedResult.reduce(
    //     (acc, { transactions }) => [...acc, ...transactions],
    //     []
    //   ),
    //   userId,
    // })

    for (const { transactions, cards, itemId } of combinedResult) {
      await insertTransactions({
        plaidTransactions: transactions,
        userId,
      })
      await insertCards(cards)
      await updateItemById({ id: itemId })
    }

    logger.info(
      `Transactions successfully processed for user ${userId} for items ${items.map(
        item => (item.alias ? item.alias : item.accessToken)
      )}`
    )

    next()
  } catch (error) {
    console.log(error)
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

export const getHistoricalBalanceByCard = async (_: Request, res: Response) => {
  const { userId } = res.locals

  logger.debug('In getDailySumByCard middleware.')

  try {
    // Get historical daily sums
    const sortedDailyCardSums = await dbDailySumByCard(userId)
    if (sortedDailyCardSums.length <= 0) {
      throw new Error('No transactions found to compute historical balances.')
    }

    const dailySums = sortedDailyCardSums.reduce((acc, { id, sum, date }) => {
      if (!acc[date]) {
        acc[date] = {}
      }

      acc[date][id] = sum
      return acc
    }, {} as HistoricalBalances)

    // Get current balances.
    const cards: Array<{
      amount: number
      id: string
      type: string
    }> = (await getCards({ userId })).map(card => ({
      id: card.account_id,
      type: card.type,
      amount:
        card.type === 'depository'
          ? card.balances.available
          : card.balances.current,
    }))

    const cardTypeMap = cards.reduce(
      (acc, { type, id }) => ({ ...acc, [id]: type }),
      {} as { [id: string]: string }
    )

    const cardFirstDateMap: { [id: string]: string } = cards.reduce(
      (acc, card) => {
        const firstDate = sortedDailyCardSums.find(
          dailyCardSum => dailyCardSum.id === card.id
        )

        return {
          ...acc,
          [card.id]: firstDate
            ? firstDate.date
            : // If no txs can be found, default to first date
              sortedDailyCardSums[0].date,
        }
      },
      {}
    )

    // Create template with dates
    const earliestDateMilli = moment(
      sortedDailyCardSums[0].date,
      'YYYY-MM-DD',
      true
    ).valueOf()
    const dateCount = Math.ceil(
      (moment().valueOf() - earliestDateMilli) / 86400000
    )

    const dateTemplate = Array(dateCount)
      .fill(null)
      .map((_, i) => i * 86400000 + earliestDateMilli)
      .map(date => moment(date).format('YYYY-MM-DD'))

    // Map through dateTemplate, looking for matching dates from dailySums. Pull previous date if no matching date is found.

    const unadjustedHistoricalBalances: DailyBalancesWithDate[] = []
    for (const [i, date] of dateTemplate.entries()) {
      const startingBalances = unadjustedHistoricalBalances[i - 1]
        ? unadjustedHistoricalBalances[i - 1].balances
        : {}

      unadjustedHistoricalBalances[i] = {
        date,
        balances: dailySums[date]
          ? cards.reduce((acc, { id }) => {
              if (moment(cardFirstDateMap[id]) <= moment(date)) {
                acc[id] =
                  cardTypeMap[id] === 'depository'
                    ? subtract(
                        startingBalances[id] || 0,
                        dailySums[date][id] || 0
                      )
                    : add(startingBalances[id] || 0, dailySums[date][id] || 0)
              }

              return acc
            }, {} as DailyBalances)
          : startingBalances,
      }
    }

    // Get the offset
    const unadjustedMostRecentDateData =
      unadjustedHistoricalBalances[unadjustedHistoricalBalances.length - 1]
    const offset: {
      [id: string]: number
    } = cards.reduce(
      (acc, { id, amount }) => ({
        ...acc,
        [id]: amount - unadjustedMostRecentDateData.balances[id],
      }),
      {}
    )

    // Update all data with new offset, and format
    const adjustedHistoricalBalances: HistoricalBalances = unadjustedHistoricalBalances
      .map(
        ({ date, balances }) =>
          ({
            date,
            balances: Object.entries(balances).reduce((acc, [id, amount]) => {
              acc[id] = (offset[id] + amount).toFixed(2)

              return acc
            }, {}),
          } as DailyBalancesWithDate)
      )
      .reduce(
        (acc, { date, balances }) => ({ ...acc, [date]: balances }),
        {} as HistoricalBalances
      )

    const resBody: ContractRetrieveHistoricalBalance = {
      status: 'Successfully retrieved transactions',
      success: true,
      error: null,
      historicalBalances: adjustedHistoricalBalances,
    }

    res.json(resBody)
  } catch (error) {
    logger.error(error)
    res
      .status(500)
      .json(
        generateGenericErrorResponse(
          error,
          'Error retrieving historical balances.'
        )
      )
  }
}

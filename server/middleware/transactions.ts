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
import {
  deleteCards,
  insertCards,
  getCards,
  dbDailySumByCard,
} from '../database/cards'
import { ContractResponse, generateGenericErrorResponse } from '.'
import { convertPlaidCardsToDBCards, add, subtract } from '../utils'
import { logger } from '../logger'
import moment from 'moment'

export interface ContractRetrieveTransactions extends ContractResponse {
  cards: PlaidCard[]
  transactions: PlaidTransaction[]
  items: DBItem[]
}

export interface ContractRetrieveHistoricalBalance extends ContractResponse {
  historicalBalances: HistoricalBalances
}

interface DailyBalances {
  [name: string]: number
}
interface DailyBalancesWithDate {
  date: string
  balances: DailyBalances
}
interface HistoricalBalances {
  [date: string]: DailyBalances
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
            console.log(err)
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
      id: string
      type: string
      amount: number
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

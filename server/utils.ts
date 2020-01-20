import bcrypt from 'bcrypt'
import { Account as PlaidCard } from 'plaid'
import { SALT_ROUNDS } from './constants'
import { DBCard } from './database/cards'

export const encryptPassword: ({ password }) => Promise<string> = async ({
  password,
}) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err)
        return
      }

      resolve(hash)
    })
  })
}

export const convertPlaidCardsToDBCards: (
  cards: PlaidCard[],
  userId: number,
  itemId: number
) => DBCard[] = (cards, userId, itemId) =>
  cards.map(plaidCard => {
    const {
      balances: {
        available,
        current,
        limit: credit_limit,
        iso_currency_code,
        official_currency_code,
      },
      ...sharedFields
    } = plaidCard

    return {
      ...sharedFields,
      userId,
      itemId,
      available,
      current,
      credit_limit,
      iso_currency_code,
      official_currency_code,
    }
  })

export const add: (x: number, y: number) => number = (x, y) => x + y
export const subtract: (x: number, y: number) => number = (x, y) => x - y

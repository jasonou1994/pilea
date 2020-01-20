import { TransactionsResponse } from 'plaid'
import { client } from '../constants'

export const plaidGetTransactions: ({
  token,
  start,
  end,
  options,
}: {
  end: string
  options: {
    count: number
    offset: number
  }
  start: string
  token: string
}) => Promise<TransactionsResponse> = ({ token, start, end, options }) =>
  new Promise((resolve, reject) => {
    client.getTransactions(token, start, end, options, (err, result) => {
      result ? resolve(result) : reject(err)
    })
  })

export const plaidGetAccessToken: ({
  public_token,
}) => Promise<string> = async ({ public_token }) =>
  new Promise((resolve, reject) => {
    client.exchangePublicToken(public_token, (err, tokenResponse) => {
      if (err) {
        reject(err)
      }

      const { access_token } = tokenResponse

      resolve(access_token)
    })
  })

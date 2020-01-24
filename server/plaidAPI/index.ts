import { TransactionsResponse, Client, environments } from 'plaid'
import { getPlaidCredentials } from '../secrets'
import { MODE } from '../env'
import { logger } from '../logger'

let client: Client = undefined
getPlaidCredentials()
  .then(({ clientId, testSecret, devSecret, publicKey }) => {
    client = new Client(
      clientId,
      MODE === 'TEST' ? testSecret : devSecret,
      publicKey,
      environments[MODE === 'TEST' ? 'sandbox' : 'development']
    )
    logger.debug('Plaid client successfully created.')
  })
  .catch(err => logger.error(err))

export const getPlaidClient = () => client

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

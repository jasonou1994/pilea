import { Request, Response } from 'express'
import { ContractResponse } from '.'
import { client } from '../constants'
import { logger } from '../logger'

export interface ContractPlaidGetAccessToken extends ContractResponse {
  access_token: string | null
  item_id: string | null
}

export const getAccessToken = async (req: Request, res: Response) => {
  logger.debug('In getAccessToken middleware.')

  try {
    const { public_token: PUBLIC_TOKEN } = req.body

    const { access_token, item_id } = await new Promise((resolve, reject) => {
      client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
        error ? reject(error) : resolve(tokenResponse)
      })
    })

    res.json({
      error: null,
      success: true,
      status: 'Successfully exchanged public token',
      access_token,
      item_id,
    } as ContractPlaidGetAccessToken)
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
      status: 'Failed to exchange public token',
      access_token: null,
      item_id: null,
    } as ContractPlaidGetAccessToken)
  }
}

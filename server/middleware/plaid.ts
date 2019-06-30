import { Request, Response } from 'express'
import { client } from '../constants'

export interface ContractPlaidGetAccessToken {
  success: boolean
  access_token: string | null
  item_id: string | null
}

export const getAccessToken = (req: Request, res: Response) => {
  const { public_token: PUBLIC_TOKEN } = req.body
  client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
    if (error) {
      return res.json({
        error,
        success: false,
        status: 'Failed to exchange public token',
        access_token: null,
        item_id: null,
      } as ContractPlaidGetAccessToken)
    }

    const { access_token, item_id } = tokenResponse
    res.json({
      error,
      success: true,
      status: 'Successfully exchanged public token',
      access_token,
      item_id,
    } as ContractPlaidGetAccessToken)
  })
}

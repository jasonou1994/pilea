import { Response } from 'express'

export * from './items'
export * from './auth'
export * from './plaid'
export * from './transactions'
export * from './users'

export interface ContractResponse {
  status: string
  success: boolean
  error: any
}

export const sendEmptyResponse = (_, res: Response) => {
  res.json({})
}

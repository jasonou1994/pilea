import { Response, Request } from 'express'

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

export const sendEmptyResponse = (_: Request, res: Response) => {
  const body: ContractResponse = {
    status: 'Success.',
    success: true,
    error: null,
  }
  res.json(body)
}

import { Request, Response } from 'express'

export * from './items'
export * from './auth'
export * from './plaid'
export * from './transactions'
export * from './users'
export * from '../mailer'

export interface ContractResponse {
  error: any
  status: string
  success: boolean
}

export const generateGenericErrorResponse: (
  error: Error,
  status?: string
) => ContractResponse = (error, status = 'Server error.') => ({
  status,
  success: false,
  error: error.message,
})

export const sendEmptyResponse = (_: Request, res: Response) => {
  const body: ContractResponse = {
    status: 'Success.',
    success: true,
    error: null,
  }
  res.json(body)
}

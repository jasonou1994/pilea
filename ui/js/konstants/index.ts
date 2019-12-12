export * from './transactions'
export * from './accounts'
export * from './login'
export * from './graph'
export * from './grid'
export * from './api'
export * from './loading'
export * from './notifications'
export * from './sizing'

// @ts-ignore
const NODE_ENV = env.NODE_ENV

export const PLAID_PUBLIC_KEY = '134893e5d974bced3a52c91e8e6b5a'
export const PLAID_ENV = NODE_ENV === 'test' ? 'sandbox' : 'development'

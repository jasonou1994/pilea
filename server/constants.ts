import { Client, environments } from 'plaid'
import { MODE } from './env'

const PLAID_CLIENT_ID = '5c52345ce341ed0010a522f1'
const PLAID_SECRET =
  MODE === 'TEST'
    ? '41ab53239da6e8befa565671fc4ce3'
    : '259a3db7aec2d3314a6e545d056a10'
const PLAID_PUBLIC_KEY = '134893e5d974bced3a52c91e8e6b5a'
const PLAID_ENV = MODE === 'TEST' ? 'sandbox' : 'development'

export const client = new Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  environments[PLAID_ENV],
  { version: '2019-05-29' }
)

export const connection = {
  host: 'salt.db.elephantsql.com',
  user: 'dsfmzvss',
  password: 'aF0mHO72woTeIwag11r5qPRVC1YsLc3k',
  database: 'dsfmzvss',
}

export const nodemailerConfig = {
  auth: {
    user: 'jason@mypilea.com',
    pass: 'tihjaJ-xymfom-ruzsu4',
  },
}

export const NO_TOKEN_AUTH_ERROR =
  'No Authorization: Bearer header present on request'
export const INVALID_TOKEN_AUTH_ERROR =
  'Invalid Authorization: Bearer token on request'
export const EXPIRED_TOKEN_ERROR = 'jwt expired'

//Password
export const SALT_ROUNDS = 10

//DB
export const USERS = 'users'
export const ITEMS = 'items'
export const TRANSACTIONS = 'transactions'
export const CARDS = 'cards'
export const ACCESS_TOKENS = 'access_tokens'

//jwt
export const key = 'jasonou1'

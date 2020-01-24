import knex from 'knex'
import { connection } from './constants'

export const getDbClient() = knex({ client: 'pg', connection })

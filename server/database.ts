import knex from 'knex'
import { logger } from './logger'
import { getDBCredentials } from './secrets'

let dbClient = undefined

getDBCredentials()
  .then(({ username, password, host, dbname }) => {
    logger.debug('Mailer client successfully created.')

    dbClient = knex({
      client: 'pg',
      connection: {
        host,
        user: username,
        password,
        database: dbname,
      },
    })
  })
  .catch(err => logger.error(err))

export const getDbClient = () => dbClient

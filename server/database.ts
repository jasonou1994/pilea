import knex from 'knex'
import { getDBCredentials } from './secrets'
import { logger } from './logger'

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

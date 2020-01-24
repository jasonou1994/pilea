import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { NextFunction, Request, Response } from 'express'
import { redirectToHTTPS } from 'express-http-to-https'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { items } from './controllers/items'
import { plaid } from './controllers/plaid'
import { transactions } from './controllers/transactions'
import { user } from './controllers/user'
import { CORS_URL, INSECURE_PORT, MODE, PORT } from './env'
import { expressLogger, logger, logReq } from './logger'

const app = express()

if (MODE === 'PRODUCTION') {
  app.use(redirectToHTTPS())
}
app.use(expressLogger)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logReq)
app.use(compression())
app.use((_, res: Response, next: NextFunction) => {
  res.header(
    'Access-Control-Allow-Origin',
    MODE === 'PRODUCTION' ? 'https://mypilea.com' : CORS_URL
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use('/transactions', transactions)
app.use('/plaid', plaid)
app.use('/user', user)
app.use('/items', items)

app.use(express.static('build'))
app.get('/*', (_: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../build/index.html'))
)

https
  .createServer(
    {
      cert: fs.readFileSync('./sslcert/fullchain.pem'),
      key: fs.readFileSync('./sslcert/privkey.pem'),
    },
    app
  )
  .listen(PORT, () => {
    logger.info(`Express server listening on ${PORT}.`)
  })

// Only for redirection
app.listen(INSECURE_PORT, () => {
  logger.info(`Redirection Express server listening on ${INSECURE_PORT}.`)
})

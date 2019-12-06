import path from 'path'
import https from 'https'
import fs from 'fs'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { redirectToHTTPS } from 'express-http-to-https'
import { expressLogger, logger, logReq } from './logger'
import { transactions } from './controllers/transactions'
import { plaid } from './controllers/plaid'
import { user } from './controllers/user'
import { items } from './controllers/items'

const PORT = process.env.PORT || 443
const INSECURE_PORT = process.env.INSECURE_PORT || 80
const MODE = process.env.MODE || 'PRODUCTION'
const CORS_URL = process.env.CORS_URL || undefined

const app = express()

if (MODE === 'PRODUCTION') {
  app.use(redirectToHTTPS([/http:\/\/localhost:3000/]))
}
app.use(expressLogger)
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logReq)
app.use((_, res: Response, next: NextFunction) => {
  res.header(
    'Access-Control-Allow-Origin',
    CORS_URL
      ? CORS_URL
      : MODE === 'PRODUCTION'
      ? 'https://mypilea.com'
      : 'http://localhost:3000'
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
  .listen(443, () => {
    logger.info(`Express server listening on ${PORT}.`)
  })

// Only for redirection
app.listen(INSECURE_PORT, () => {
  logger.info(`Redirection Express server listening on ${INSECURE_PORT}.`)
})

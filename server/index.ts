import path from 'path'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { expressLogger, logger, logReq } from './logger'
import fs from 'fs'
import https from 'https'
import { transactions } from './controllers/transactions'
import { plaid } from './controllers/plaid'
import { user } from './controllers/user'
import { items } from './controllers/items'

const PORT = process.env.PORT || 8000
const app = express()

app.use(expressLogger)
app.use(bodyParser.json())
app.use(cookieParser())
app.use(logReq)
app.use(function(_, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
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

app.get('/bundle.js', (_: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../build/bundle.js'))
)
app.get('/*', (_: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../build/index.html'))
)

// https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'server.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
//   },
//   app
// )
app.listen(PORT, () => {
  logger.info(`Express server listening on ${PORT}.`)
})

import { SecretsManager } from 'aws-sdk'
import { config } from 'aws-sdk'

config.loadFromPath('./awsconfig.json')

const secretManager = new SecretsManager({ region: 'us-east-2' })

export const getSecret: (secretName: string) => Promise<any> = secretName =>
  new Promise((resolve, reject) => {
    secretManager.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
          resolve(JSON.parse(data.SecretString))
        } else {
          // @ts-ignore
          let buff = new Buffer(data.SecretBinary, 'base64')
          resolve(JSON.parse(buff.toString('ascii')))
        }
      }
    })
  })

export const getDBCredentials: () => Promise<{
  username: string
  password: string
  engine: string
  host: string
  port: string
  dbname: string
}> = () => getSecret('prod/rdb')

export const getEmailCredentials: () => Promise<{
  user: string
  pass: string
}> = () => getSecret('prod/nodemailer')

export const getPlaidCredentials: () => Promise<{
  clientId: string
  testSecret: string
  devSecret: string
  publicKey: string
}> = () => getSecret('prod/plaid')

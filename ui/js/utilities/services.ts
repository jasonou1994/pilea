import { AvailableAPIs } from '../konstants'
import { serviceDefs } from './serviceDefs'

type Services = { [name in AvailableAPIs]: any }

const API_PORT = process.env.API_PORT
const API_HOST = process.env.API_HOST
const API_PROTOCOL = 'http'

const host = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`

export const services = serviceDefs.reduce(
  (acc, service) => {
    const { name, path, ...options } = service

    acc[name] = ({ body }: { body: any } = { body: '{}' }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const url = host + path

          console.log(url, {
            ...options,
            body,
          })
          const rawResponse = await fetch(url, {
            ...options,
            ...(options.method === 'POST' ? { body } : {}),
          })
          const response = await rawResponse.json()
          const { error, success, status, ...contents } = response

          console.log(response)

          success ? resolve({ ...contents, status }) : reject({ status, error })
        } catch (error) {
          reject({ error, status: `Error in ${name}` })
        }
      })
    }

    return acc
  },
  {} as Services
)

import { AvailableAPIs } from '../konstants'
import { serviceDefs } from './serviceDefs'

type Services = {
  [name in AvailableAPIs]: any
}

// @ts-ignore
const API_PORT = env.API_PORT
// @ts-ignore
const API_HOST = env.API_HOST
// @ts-ignore
const API_PROTOCOL = env.API_PROTOCOL
// @ts-ignore
const NODE_ENV = env.NODE_ENV
console.log(API_PORT, API_HOST, API_PROTOCOL, NODE_ENV)

let cookie = ''
const parseCookies: (response: Response) => void = response => {
  const raw = response.headers.get('set-cookie')
  if (raw) {
    cookie = raw.split(';')[0]
  }
}

export const services = serviceDefs.reduce((acc, service) => {
  const { name, path, ...options } = service

  acc[name] = ({ body }: { body: any } = { body: '{}' }) =>
    new Promise(async (resolve, reject) => {
      try {
        const host = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`

        const url = host + path

        const rawResponse = await fetch(url, {
          ...options,
          ...(options.method === 'POST' ? { body } : {}),
          headers: {
            ...options.headers,
            ...(NODE_ENV === 'TEST' ? { cookie } : {}),
          },
        })

        if (NODE_ENV === 'TEST' && rawResponse.ok) {
          parseCookies(rawResponse)
        }

        const response = await rawResponse.json()
        const { error, success, status, ...contents } = response

        if (success) {
          resolve({ ...contents, status })
        } else {
          reject(
            error
              ? { status, error }
              : {
                  status: 'Unknown server error',
                  error: `Unknown server error occured: ${{ ...contents }}`,
                }
          )
        }

        success ? resolve({ ...contents, status }) : reject({ status, error })
      } catch (e) {
        console.log(e)
        reject({ error: `Unknown error: ${e}`, status: `Error in ${name}` })
      }
    })

  return acc
}, {} as Services)

import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './constants'

export const encryptPassword: ({ password }) => Promise<string> = async ({
  password,
}) => {
  return await new Promise((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err)
        return
      }

      resolve(hash)
    })
  })
}

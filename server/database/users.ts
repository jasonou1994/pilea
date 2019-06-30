import { dbClient } from '../database'
import { USERS } from '../constants'

export interface DBUser {
  id?: number
  username: string
  passwordHash?: string
  token: string
}

export const insertUser: ({
  username,
  passwordHash,
}) => Promise<void> = async ({ username, passwordHash }) => {
  await dbClient(USERS).insert({
    passwordHash: passwordHash,
    username,
  })
}

export const getUsers: ({ username }) => Promise<DBUser[]> = async ({
  username,
}) => {
  return await dbClient
    .select(['*'])
    .from(USERS)
    .where({ username })
}

export const getUserByToken: ({ token }) => Promise<DBUser> = async ({
  token,
}) => {
  const dbUser: DBUser = await new Promise((resolve, reject) => {
    dbClient
      .select('*')
      .from(USERS)
      .where({ token })
      .limit(1)
      .then(rows => resolve(rows[0]))
      .catch(err => reject(err))
  })
  return dbUser
}

export const updateUser: ({
  username,
  token,
}: DBUser) => Promise<void> = async ({ username, token }) => {
  await dbClient(USERS)
    .update({ token })
    .where({ username })
}

export const updateUserWithToken: ({
  oldToken,
  newToken,
}) => Promise<void> = async ({ oldToken, newToken }) => {
  await dbClient(USERS)
    .update({ token: newToken })
    .where({ token: oldToken })
}

export const checkUserToken: ({ token }) => Promise<boolean> = async ({
  token,
}) => {
  const result = await dbClient(USERS)
    .where({ token })
    .count('*')

  return result[0].count >= 0
}

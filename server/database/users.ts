import { dbClient } from '../database'
import { USERS } from '../constants'

export interface DBUser {
  id?: number
  username: string
  passwordHash?: string
  confirmed?: boolean
  token: string
  confirmationString?: string
  passwordResetToken?: string
}

export const insertUser: ({
  username,
  passwordHash,
  confirmed,
  confirmationString,
}) => Promise<void> = async ({
  username,
  passwordHash,
  confirmationString,
  confirmed,
}) => {
  await dbClient(USERS).insert({
    passwordHash,
    username,
    confirmed,
    confirmationString,
  })
}

export const addPasswordResetTokenToUser: ({
  username,
  passwordResetToken,
}: {
  username: string
  passwordResetToken: string
}) => Promise<boolean> = async ({ username, passwordResetToken }) => {
  const result = await dbClient(USERS)
    .update({ passwordResetToken })
    .where({ username })

  return result === 1
}

export const confirmUserDB = async (
  confirmationString: string
): Promise<boolean> => {
  const result = await dbClient(USERS)
    .update({ confirmed: true })
    .where({ confirmationString })

  if (result === 1) {
    return true
  } else {
    throw new Error('Unable to confirm user. Please check confirmation string.')
  }
}

export const getUsers: ({ username }) => Promise<DBUser[]> = async ({
  username,
}) => {
  return await dbClient
    .select('*')
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

  return result[0].count > 0
}

export const dbCheckIfUserVerified: ({ id }) => Promise<boolean> = async ({
  id,
}) => {
  const result = await dbClient(USERS)
    .where({ id, confirmed: true })
    .count('*')

  return result[0].count > 0
}

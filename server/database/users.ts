import { dbClient } from '../database'
import { USERS, ACCESS_TOKENS } from '../constants'

export interface DBUser {
  id?: number
  username: string
  passwordHash?: string
  confirmed?: boolean
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

export const addUserAccessToken: ({
  username,
  token,
}: {
  username: string
  token: string
}) => Promise<void> = async ({ username, token }) =>
  await dbClient(ACCESS_TOKENS).insert({ token, username })

export const deleteUserAccessToken: ({
  token,
}: {
  token: string
}) => Promise<number> = async ({ token }) =>
  await dbClient(ACCESS_TOKENS)
    .delete()
    .where({ token })

export const deleteAllUserAccessTokensByUsername: ({
  username,
}: {
  username: string
}) => Promise<void> = async ({ username }) => {
  await dbClient(ACCESS_TOKENS)
    .delete()
    .where({ username })
}

export const doesUserAccessTokenExist: ({
  token,
}: {
  token: string
}) => Promise<boolean> = async ({ token }) => {
  const results = await dbClient(ACCESS_TOKENS)
    .select('*')
    .where({ token })

  return results.length > 0
}

export const getUserFromUserAccessToken: ({
  token,
}: {
  token: string
}) => Promise<{
  id: number
  username: string
  confirmed: boolean
  confirmationString: string
  passwordResetToken: string
}> = async ({ token }) => {
  const results = await dbClient
    .select(
      'users.id',
      'users.username',
      'confirmed',
      'confirmationString',
      'passwordResetToken'
    )
    .from(USERS)
    .innerJoin(ACCESS_TOKENS, 'users.username', 'access_tokens.username')
    .where({ token })
    .debug(true)

  return results[0]
}

export const dbCheckIfUserVerified: ({ id }) => Promise<boolean> = async ({
  id,
}) => {
  const result = await dbClient(USERS)
    .where({ id, confirmed: true })
    .count('*')

  return result[0].count > 0
}

export const checkIfPasswordResetTokenMatches: ({
  resetToken: string,
}) => Promise<boolean> = async ({ resetToken }) => {
  const result = await dbClient(USERS)
    .where({ passwordResetToken: resetToken })
    .count('*')

  return result[0].count > 0
}

export const updatePassword: (
  password: string,
  resetToken: string
) => Promise<boolean> = async (passwordHash, resetToken) => {
  const result = await dbClient(USERS)
    .update({ passwordHash })
    .where({ passwordResetToken: resetToken })

  await dbClient(USERS)
    .update({ passwordResetToken: '' })
    .where({ passwordResetToken: resetToken })

  return result > 0
}

export const deleteUserByUsername: (
  username: string
) => Promise<void> = async username => {
  await dbClient(USERS)
    .del()
    .where({ username })
}

export const confirmUserBypassDB: (
  username: string
) => Promise<void> = async username => {
  await dbClient(USERS)
    .update({ confirmed: true })
    .where({ username })
}

export const updateUserTransactionLoadingCount: (
  count: number,
  userId: string
) => Promise<void> = async (count, userId) => {
  await dbClient(USERS)
    .update({ transactionLoadingCount: count })
    .where({ id: userId })
}

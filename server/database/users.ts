import { ACCESS_TOKENS, USERS } from '../constants'
import { getDbClient } from '../database'

export interface DBUser {
  confirmationString?: string
  confirmed?: boolean
  id?: number
  passwordHash?: string
  passwordResetToken?: string
  username: string
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
  await getDbClient()(USERS).insert({
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
  passwordResetToken: string
  username: string
}) => Promise<boolean> = async ({ username, passwordResetToken }) => {
  const result = await getDbClient()(USERS)
    .update({ passwordResetToken })
    .where({ username })

  return result === 1
}

export const confirmUserDB = async (
  confirmationString: string
): Promise<boolean> => {
  const result = await getDbClient()(USERS)
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
  return await getDbClient()
    .select('*')
    .from(USERS)
    .where({ username })
}

export const addUserAccessToken: ({
  username,
  token,
}: {
  token: string
  username: string
}) => Promise<void> = async ({ username, token }) =>
  await getDbClient()(ACCESS_TOKENS).insert({ token, username })

export const deleteUserAccessToken: ({
  token,
}: {
  token: string
}) => Promise<number> = async ({ token }) =>
  await getDbClient()(ACCESS_TOKENS)
    .delete()
    .where({ token })

export const deleteAllUserAccessTokensByUsername: ({
  username,
}: {
  username: string
}) => Promise<void> = async ({ username }) => {
  await getDbClient()(ACCESS_TOKENS)
    .delete()
    .where({ username })
}

export const doesUserAccessTokenExist: ({
  token,
}: {
  token: string
}) => Promise<boolean> = async ({ token }) => {
  const results = await getDbClient()(ACCESS_TOKENS)
    .select('*')
    .where({ token })

  return results.length > 0
}

export const getUserFromUserAccessToken: ({
  token,
}: {
  token: string
}) => Promise<{
  confirmationString: string
  confirmed: boolean
  id: number
  passwordResetToken: string
  username: string
}> = async ({ token }) => {
  const results = await getDbClient()
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
  const result = await getDbClient()(USERS)
    .where({ id, confirmed: true })
    .count('*')

  return result[0].count > 0
}

export const checkIfPasswordResetTokenMatches: ({
  resetToken: string,
}) => Promise<boolean> = async ({ resetToken }) => {
  const result = await getDbClient()(USERS)
    .where({ passwordResetToken: resetToken })
    .count('*')

  return result[0].count > 0
}

export const updatePassword: (
  password: string,
  resetToken: string
) => Promise<boolean> = async (passwordHash, resetToken) => {
  const result = await getDbClient()(USERS)
    .update({ passwordHash })
    .where({ passwordResetToken: resetToken })

  await getDbClient()(USERS)
    .update({ passwordResetToken: '' })
    .where({ passwordResetToken: resetToken })

  return result > 0
}

export const deleteUserByUsername: (
  username: string
) => Promise<void> = async username => {
  await getDbClient()(USERS)
    .del()
    .where({ username })
}

export const confirmUserBypassDB: (
  username: string
) => Promise<void> = async username => {
  await getDbClient()(USERS)
    .update({ confirmed: true })
    .where({ username })
}

export const updateUserTransactionLoadingCount: (
  count: number,
  userId: string
) => Promise<void> = async (count, userId) => {
  await getDbClient()(USERS)
    .update({ transactionLoadingCount: count })
    .where({ id: userId })
}

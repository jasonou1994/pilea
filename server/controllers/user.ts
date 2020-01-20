import { Router } from 'express'
import {
  addAuthToken,
  checkDeleteAuthToken,
  confirmUser,
  confirmUserBypass,
  createUser,
  deleteAccount,
  getUserId,
  processForgotPassword,
  processLogIn,
  resetPassword,
  sendCreateUserResponse,
  sendEmptyResponse,
  sendLogInResponse,
} from '../middleware'

export const user = Router()

user.post(
  '/create',
  createUser,
  addAuthToken,
  getUserId,
  sendCreateUserResponse
)

user.post('/login', processLogIn, addAuthToken, sendLogInResponse)

user.post('/logout', checkDeleteAuthToken, sendEmptyResponse)

user.post('/password/forgot', processForgotPassword)

user.get('/confirm/:confirmationString', confirmUser)

user.post('/password/reset/:resetToken', resetPassword)

user.post('/admin/delete', deleteAccount)

user.post('/admin/confirm', confirmUserBypass)

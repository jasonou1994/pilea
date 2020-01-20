import nodemailer from 'nodemailer'
import { nodemailerConfig } from './constants'
import { HOST, MODE } from './env'
import { logger } from './logger'

logger.debug(`Email sent to following url: ${HOST}`)

export const sendSignUpEmail = async (
  address: string,
  confirmationString: string
) => {
  logger.debug('In sendSignUpEmail.')

  const url = `${HOST}/user/confirm/${confirmationString}`
  if (MODE !== 'TEST') {
    await sendMail(address, {
      subject: 'Welcome to Pilea!',
      html: `<b>Welcome to Pilea! Please click on this <a href="${url}">confirmation link</a> to finish signing-up.</b>`,
    })
  }
  logger.debug(`Email was sent to ${url}`)
}

export const sendForgotPasswordEmail = async (
  address: string,
  passwordResetToken: string
) => {
  logger.debug('In sendForgotPasswordEmail.')
  if (MODE !== 'TEST') {
    await sendMail(address, {
      subject: 'Forgot your password?',
      html: `<b>Please disregard this email if you have not attempted to reset your Pilea account. Click <a href="${HOST}/password/reset/${passwordResetToken}">here</a> to choose a new password.</b>`,
    })
  }
}

const sendMail = async (address, { subject, html }) => {
  logger.debug('In sendMail.')

  const transporter = SMTPTransporter.getTransporter()

  await transporter.sendMail({
    to: address,
    subject,
    html,
  })
}

const SMTPTransporter = {
  transporter: undefined,
  getTransporter: () => {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        pool: true,
        ...nodemailerConfig,
      })
    }

    return this.transporter
  },
}

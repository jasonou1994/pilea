import nodemailer from 'nodemailer'
import { nodemailerConfig } from './constants'
import { logger } from './logger'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8000

const host = `${HOST}${PORT === '80' ? '' : ':' + PORT}`

logger.debug(`Email sent to following url: ${host}`)

export const sendSignUpEmail = async (
  address: string,
  confirmationString: string
) => {
  logger.debug('In sendSignUpEmail.')
  await sendMail(address, {
    subject: 'Welcome to Pilea!',
    html: `<b>Welcome to Pilea! Please click on this <a href="https://${HOST}/user/confirm/${confirmationString}">confirmation link</a> to finish signing-up.</b>`,
  })
}

export const sendForgotPasswordEmail = async (
  address: string,
  passwordResetToken: string
) => {
  logger.debug('In sendForgotPasswordEmail.')
  await sendMail(address, {
    subject: 'Forgot your password?',
    html: `<b>Please disregard this email if you have not attempted to reset your Pilea account. Click <a href="https://${host}/password/reset/${passwordResetToken}">here</a> to choose a new password.</b>`,
  })
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

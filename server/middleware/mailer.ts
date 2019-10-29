import nodemailer from 'nodemailer'
import { nodemailerConfig } from '../constants'

export const sendSignUpEmail = async (
  address: string,
  confirmationString: string
) => {
  await sendMail(address, {
    subject: 'Welcome to Pilea!',
    html: `<b>Welcome to Pilea! Please click on this <a href="http://localhost:8000/user/confirm/${confirmationString}">confirmation link</a> to finish signing-up.</b>`,
  })
}

export const sendForgotPasswordEmail = async (
  address: string,
  passwordResetToken: string
) => {
  await sendMail(address, {
    subject: 'Forgot your password?',
    html: `<b>Please disregard this email if you have not attempted to reset your Pilea account. Click <a href="http://localhost:8000/password/reset/${passwordResetToken}">here</a> to choose a new password.</b>`,
  })
}

const sendMail: (
  address: string,
  { subject, html }: { subject: string; html: string }
) => Promise<boolean> = async (address, { subject, html }) => {
  try {
    const transporter = SMTPTransporter.getTransporter()

    await transporter.sendMail({
      to: address,
      subject,
      html,
    })

    return true
  } catch (e) {
    console.error('Error sending email: ', e)
    return false
  }
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

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

const sendMail = async (address: string, { subject, html }) => {
  console.log(address)
  const transporter = SMTPTransporter.getTransporter()

  // send mail with defined transport object
  const info = await transporter.sendMail({
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

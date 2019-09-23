import nodemailer from 'nodemailer'
import { Request, Response, NextFunction } from 'express'
import { nodemailerConfig } from '../constants'

export const sendMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { messageType, userEmail } = res.locals

  const transporter = SMTPTransporter.getTransporter()

  // send mail with defined transport object
  const info = await transporter.sendMail({
    to: userEmail, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  })

  next()
}

export const SMTPTransporter = {
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

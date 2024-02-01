const nodemailer = require('nodemailer')
const templates = require('./email.templates')
const {mailSchema} = require('./schemas')
const {validPayload} = require('../../utils/payload')

function createTransport() {
  // Use mailhog in development
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({
      host: 'localhost',
      port: 587
    })
  }

  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST must be provided in production mode')
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'YES',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

const transport = createTransport()

async function sendTemplateMail(templateKey) {
  const template = templates[templateKey]
  if (!template) {
    throw new Error(`Le template ${templateKey} n'existe pas`)
  }

  const response = await transport.sendMail(template)

  if (!response) {
    throw new Error('Une erreur est survenue lors de l\'envoi de l\'email')
  }

  return true
}

async function checkCaptcha(captchaToken) {
  const response = await fetch(`https://api.hcaptcha.com/siteverify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `response=${captchaToken}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
  })

  const json = await response.json()

  if (!json.success) {
    throw new Error('Le captcha est invalide')
  }

  return json.success
}

async function sendFormContactMail(payload) {
  const validatedPayload = validPayload(payload, mailSchema)
  const {captchaToken, ...emailData } = validatedPayload

  await checkCaptcha(captchaToken)

  const contactTemplate = templates.contact(emailData)

  const response = await transport.sendMail(contactTemplate)

  if (!response) {
    throw new Error('Une erreur est survenue lors de l\'envoi de l\'email')
  }

  return true
}


module.exports = {
  sendTemplateMail,
  sendFormContactMail
}

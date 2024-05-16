const nodemailer = require('nodemailer')
const templates = require('./email.templates')
const {mailSchema, signalementOtherMailSchema, signalementMissingNumberMailSchema, signalementMissingStreetMailSchema} = require('./schemas')
const {validPayload} = require('../../utils/payload')
const {getCommuneEmail} = require('../../utils/api-annuaire')

const apiDepotBaseUrl = process.env.NEXT_PUBLIC_API_DEPOT_URL || "https://plateforme-bal.adresse.data.gouv.fr/api-depot"

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

async function sendSignalementToCommune(payload) {
  let schema

  switch (payload.subject) {
    case 'Adresse non répertoriée':
      schema = signalementMissingNumberMailSchema
      break
    case 'Voie non répertoriée':
      schema = signalementMissingStreetMailSchema
      break
    default:
      schema = signalementOtherMailSchema
  }
  const validatedPayload = validPayload(payload, schema)
  const {captchaToken, ...emailData } = validatedPayload

  await checkCaptcha(captchaToken)

  const communeEmail = await getCommuneEmail(emailData.city)

  const currentRevisionResponse = await fetch(`${apiDepotBaseUrl}/communes/${emailData.city}/current-revision`)
  const currentRevision = await currentRevisionResponse.json()
  const publication = {
    client: currentRevision?.client?.nom,
  }
  if (currentRevision?.client?.nom === 'Mes Adresses') {
    publication.balId = currentRevision?.context?.extras?.balId
  } else if (currentRevision?.client?.nom === 'Moissonneur BAL') {
    const sourceId = currentRevision?.context?.extras?.sourceId
    if (sourceId) {
      const ids = sourceId.split('-')
      const response = await fetch(`https://www.data.gouv.fr/api/1/datasets/${ids[1]}`)
      const dataset = await response.json()
      publication.organization = dataset?.organization?.name
    }
  }

  const template = templates.signalementToCommune(emailData, communeEmail, publication)

  const response = await transport.sendMail(template)

  if (!response) {
    throw new Error('Une erreur est survenue lors de l\'envoi de l\'email')
  }

  return true
}


module.exports = {
  sendTemplateMail,
  sendFormContactMail,
  sendSignalementToCommune
}

const {ObjectId} = require('mongodb')
const mongoClient = require('../../utils/mongo-client')
const {validPayload} = require('../../utils/payload')
const {sendMail} = require('../mailer/service')
const {createCommuneSchema, createOrganismeSchema, createEntrepriseSchema} = require('./schemas')

const collectionName = 'partenaires-de-la-charte'

async function findMany(query = {}) {
  const {codeDepartement, services, type, withCandidates, withoutPictures} = query

  const mongoQuery = withCandidates ? {} : {
    signatureDate: {$exists: true}
  }

  if (type) {
    mongoQuery.type = type
  }

  if (codeDepartement) {
    mongoQuery.$or = [
      {codeDepartement: {$in: [codeDepartement]}},
      {isPerimeterFrance: true}
    ]
  }

  if (services) {
    mongoQuery.services = {$in: services.split(',')}
  }

  const records = await mongoClient.findMany(collectionName, mongoQuery)

  if (withoutPictures) {
    return records.map(record => {
      const {picture, ...rest} = record
      return rest
    })
  }

  return records
}

async function findOneOrFail(id) {
  const record = mongoClient.findOneById(collectionName, id)

  if (!record) {
    throw new Error(`Partenaire de la charte ${id} introuvable`)
  }

  return record
}

async function findDistinct(property) {
  const records = await mongoClient.findDistinct(collectionName, property)

  return records
}

async function createOne(payload, options = {}) {
  const {isCandidate, noValidation} = options
  let validationSchema
  switch (payload.type) {
    case 'commune':
      validationSchema = createCommuneSchema
      break
    case 'organisme':
      validationSchema = createOrganismeSchema
      break
    case 'entreprise':
      validationSchema = createEntrepriseSchema
      break
    default:
      throw new Error(`Type de partenaire inconnu: ${payload.type}`)
  }

  const newRecord = noValidation ? payload : validPayload(payload, validationSchema)

  newRecord._id = new ObjectId()
  if (!isCandidate) {
    newRecord.signatureDate = new Date()
  }

  await mongoClient.insertOne(collectionName, newRecord)

  if (isCandidate) {
    await sendMail('candidature-partenaire-de-la-charte')
  }

  return newRecord
}

async function updateOne(id, payload, {acceptCandidacy = false}) {
  let validationSchema
  switch (payload.type) {
    case 'commune':
      validationSchema = createCommuneSchema
      break
    case 'organisme':
      validationSchema = createOrganismeSchema
      break
    case 'entreprise':
      validationSchema = createEntrepriseSchema
      break
    default:
      throw new Error(`Type de partenaire inconnu: ${payload.type}`)
  }

  if (!acceptCandidacy) {
    validationSchema = {
      ...validationSchema,
      signatureDate: {isRequired: true, type: 'string'}
    }
  }

  const newRecord = validPayload(payload, validationSchema)
  newRecord.signatureDate = acceptCandidacy ? new Date() : new Date(newRecord.signatureDate)

  await findOneOrFail(id)
  const updatedRecord = await mongoClient.updateOne(collectionName, id, newRecord)

  return updatedRecord
}

async function deleteOne(id) {
  const recordToDelete = await findOneOrFail(id)
  await mongoClient.deleteOne(collectionName, id, recordToDelete)

  return true
}

module.exports = {
  findMany,
  findOneOrFail,
  createOne,
  updateOne,
  deleteOne,
  findDistinct
}

const {ObjectId} = require('mongodb')
const mongoClient = require('../../utils/mongo-client')
const {validPayload} = require('../../utils/payload')
const {createSchema} = require('./schemas')

const collectionName = 'events'

async function findMany(query = {}) {
  const {type, isSubscriptionClosed} = query

  const mongoQuery = {}

  if (type) {
    mongoQuery.type = type
  }

  if (isSubscriptionClosed) {
    mongoQuery.isSubscriptionClosed = isSubscriptionClosed
  }

  return mongoClient.findMany(collectionName, mongoQuery)
}

async function findOneOrFail(id) {
  const record = await mongoClient.findOneById(collectionName, id)

  if (!record) {
    throw new Error(`Evènement ${id} introuvable`)
  }

  return record
}

async function createOne(payload) {
  const newRecord = validPayload(payload, createSchema)
  newRecord._id = new ObjectId()

  await mongoClient.insertOne(collectionName, newRecord)

  return newRecord
}

async function createMany(events) {
  // Check first that all events are valid
  for (const event of events) {
    validPayload(event, createSchema)
  }
  for await (const event of events) {
    await createOne(event)
  }
}

async function updateOne(id, payload) {
  const newRecord = validPayload(payload, createSchema)
  await findOneOrFail(id)
  return mongoClient.updateOne(collectionName, id, newRecord)
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
  createMany,
  updateOne,
  deleteOne,
}

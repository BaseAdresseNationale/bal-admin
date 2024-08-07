const {MongoClient, ObjectId} = require('mongodb')

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const MONGODB_DBNAME = process.env.MONGODB_DBNAME || 'bal-admin'

class Mongo {
  async connect(connectionString) {
    this.client = new MongoClient(connectionString || MONGODB_URL)
    await this.client.connect()

    this.db = this.client.db(MONGODB_DBNAME)
  }

  disconnect(force) {
    const {client} = this
    this.client = undefined
    this.db = undefined
    return client.close(force)
  }

  parseObjectId(string) {
    try {
      return new ObjectId(string)
    } catch {
      return null
    }
  }

  decorateCreation(obj) {
    const now = new Date()
    obj._created = now
    obj._updated = now
  }

  decorateModification(obj) {
    obj._updated = new Date()
  }

  async touchDocument(collectionName, id, date = new Date()) {
    await this.db.collection(collectionName).updateOne(
      {_id: this.parseObjectID(id)},
      {$set: {_updated: date}}
    )
  }

  async touchDocumentWithManyIds(collectionName, objectIds, date = new Date()) {
    await this.db.collection(collectionName).updateMany(
      {_id: {$in: objectIds}},
      {$set: {_updated: date}}
    )
  }

  insertOne(collectionName, obj, addDeleted = false) {
    this.decorateCreation(obj, addDeleted)
    return this.db.collection(collectionName).insertOne(obj)
  }

  updateOne(collectionName, id, obj) {
    this.decorateModification(obj)
    return this.db.collection(collectionName).updateOne(
      {_id: this.parseObjectId(id)},
      {$set: obj}
    )
  }

  deleteOne(collectionName, id, obj) {
    this.decorateModification(obj)
    return this.db.collection(collectionName).updateOne(
      {_id: this.parseObjectId(id)},
      {$set: {
        ...obj,
        _deleted: new Date()
      }}
    )
  }

  findOneById(collectionName, id) {
    return this.db.collection(collectionName).findOne({_id: this.parseObjectId(id)})
  }

  findOne(collectionName, options = {}) {
    return this.db.collection(collectionName).findOne({_deleted: undefined, ...options})
  }

  findMany(collectionName, options = {}) {
    return this.db.collection(collectionName).find({_deleted: undefined, ...options}).toArray()
  }

  findManyPaginated(collectionName, options = {}, page = 1, pageSize = 20) {
    return this.db.collection(collectionName).find({_deleted: undefined, ...options})
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .toArray()
  }

  count(collectionName, options = {}) {
    return this.db.collection(collectionName).countDocuments({_deleted: undefined, ...options})
  }

  findDistinct(collectionName, field) {
    return this.db.collection(collectionName).distinct(field)
  }
}

module.exports = new Mongo()

const mongoClient = require("../../utils/mongo-client");

const collectionName = "bal-widget";

async function getConfig(query = {}) {
  const { draft } = query;

  const mongoQuery = {
    type: draft ? "draft" : "published",
  };

  try {
    const {_id, _created, _updated, ...record} = await mongoClient.findOne(collectionName, mongoQuery);

    return record;
  } catch (error) {
    return null
  }
}

async function setConfig(payload) {
  const { draft, ...update } = payload;
  const type = draft ? "draft" : "published"
  const record = await mongoClient.findOne(collectionName, {type});

  if (!record) {
    await mongoClient.insertOne(collectionName, {type, ...update});
  } else {
    await mongoClient.updateOne(collectionName, record._id, {type, ...update});
  }

  return update;
}

module.exports = {
  getConfig,
  setConfig,
};

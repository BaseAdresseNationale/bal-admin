const mongoClient = require("../../utils/mongo-client");
const {apiDepotClient} = require("../../proxy-api-depot");
const {apiMoissonneurClient} = require("../../proxy-api-moissonneur-bal");

const NEXT_PUBLIC_API_MES_ADRESSES = process.env.NEXT_PUBLIC_API_MES_ADRESSES || 'https://api-bal.adresse.data.gouv.fr/v1'

const collectionName = "bal-widget";

async function getConfig(query = {}) {
  const { draft } = query;

  const mongoQuery = {
    type: draft ? "draft" : "published",
  };

  const {_id, _created, _updated, ...record} = await mongoClient.findOne(collectionName, mongoQuery);

  return record;
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

async function getCommuneInfos(code) {
  const mesAdressesResponse =  await fetch(`${NEXT_PUBLIC_API_MES_ADRESSES}/bases-locales/search?commune=${code}`)
  const mesAdressesResponseData = await mesAdressesResponse.json()
  const balsMesAdresses = mesAdressesResponseData.results.filter(({status}) => {
    return status === 'published' || status === 'replaced'
  })

  const apiDepotRevisionsResponse = await apiDepotClient.get(`communes/${code}/revisions?status=all`)

  const apiMoissonneurRevisionsResponse = await apiMoissonneurClient.get(`communes/${code}/revisions`)

  return {
    balsMesAdresses,
    apiDepotRevisions: apiDepotRevisionsResponse.body,
    apiMoissonneurRevisions: apiMoissonneurRevisionsResponse.body,
  };
}

module.exports = {
  getConfig,
  setConfig,
  getCommuneInfos,
};

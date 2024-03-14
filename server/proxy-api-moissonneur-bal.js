const express = require('express')
const got = require('got')

const w = require('./w')

const API_MOISSONEUR_BAL = process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL || 'https://plateforme-bal.adresse.data.gouv.fr/moissonneur'
const {API_MOISSONEUR_BAL_TOKEN} = process.env

const client = got.extend({
  prefixUrl: API_MOISSONEUR_BAL,
  headers: {
    authorization: `Token ${API_MOISSONEUR_BAL_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function harvestSource(req, res) {
  let sourceId
  if (req.params.sourceId.startsWith("datagouv-")) {
    const id = sourceId.split("-")[1]
    sourceId = validateObjectId(id)
  } else {
    sourceId = validateObjectId(req.params.sourceId)
  }

  const response = await client.post(`sources/${sourceId}/harvest`)
  forward(response, res)
}

async function updateSource(req, res) {
  let sourceId
  if (req.params.sourceId.startsWith("datagouv-")) {
    const id = sourceId.split("-")[1]
    sourceId = validateObjectId(id)
  } else {
    sourceId = validateObjectId(req.params.sourceId)
  }

  const response = await client.put(`sources/${sourceId}`, {json: req.body})
  forward(response, res)
}

async function publishRevision(req, res) {
  const revisionId = validateObjectId(req.params.revisionId)
  const response = await client.post(`revisions/${revisionId}/publish`, {json: req.body})
  forward(response, res)
}

async function getRevisionsByCommune(req, res) {
  const {codeCommune} = req.params
  const response = await client.get(`communes/${codeCommune}/revisions`)
  forward(response, res)
}

async function updateOrganization(req, res) {
  const organizationId = validateObjectId(req.params.organizationId)
  const response = await client.put(`organizations/${organizationId}`, {json: req.body})
  forward(response, res)
}


const app = new express.Router()

app.use(express.json())

// Sources
app.post('/sources/:sourceId/harvest', w(harvestSource))
app.put('/organizations/:organizationId', w(updateOrganization))
app.put('/sources/:sourceId', w(updateSource))
app.post('/revisions/:revisionId/publish', w(publishRevision))
app.get('/communes/:codeCommune/revisions', w(getRevisionsByCommune))

module.exports = app

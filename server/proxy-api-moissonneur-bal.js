const express = require('express')
const got = require('got')

const w = require('./w')

const API_MOISSONEUR_BAL = process.env.NEXT_PUBLIC_API_MOISSONEUR_BAL || 'https://plateforme.adresse.data.gouv.fr'
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
  const {sourceId} = req.params

  const response = await client.post(`sources/${sourceId}/harvest`)
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

// Sources
app.post('/sources/:sourceId/harvest', w(harvestSource))

module.exports = app

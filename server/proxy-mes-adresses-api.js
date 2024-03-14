const express = require('express')
const got = require('got')
const {validateObjectId} = require('./utils/payload')
const w = require('./w')

const API_MES_ADRESSES_URL = process.env.NEXT_PUBLIC_API_MES_ADRESSES || 'https://api-bal.adresse.data.gouv.fr/v2'
const API_MES_ADDRESSES_TOKEN = process.env.API_MES_ADDRESSES_TOKEN || ''

const client = got.extend({
  prefixUrl: API_MES_ADRESSES_URL,
  headers: {
    authorization: `Bearer ${API_MES_ADDRESSES_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function getBal(req, res) {
  const balId = validateObjectId(req.params.baseLocaleId)
  const response = await client.get(`bases-locales/${balId}`)
  forward(response, res)
}

async function searchBal(req, res) {
  const queryString = Object.keys(req.query)
    .map((key) => `${key}=${String(req.query[key])}`)
    .join("&");
  const response = await client.get(`bases-locales/search/?${queryString}`)
  forward(response, res)
}

async function removeBal(req, res) {
  const balId = validateObjectId(req.params.baseLocaleId)
  const response = await client.delete(`bases-locales/${balId}`)
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

app.get('/bases-locales/search', w(searchBal))
app.get('/bases-locales/:baseLocaleId', w(getBal))
app.delete('/bases-locales/:baseLocaleId', w(removeBal))

module.exports = app


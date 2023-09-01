const express = require('express')
const got = require('got')

const w = require('./w')

const API_MES_ADRESSES_URL = process.env.NEXT_PUBLIC_API_MES_ADRESSES || 'https://api-bal.adresse.data.gouv.fr/v1'
const API_MES_ADDRESSES_TOKEN = process.env.API_MES_ADDRESSES_TOKEN || ''

const client = got.extend({
  prefixUrl: API_MES_ADRESSES_URL,
  headers: {
    authorization: `Token ${API_MES_ADDRESSES_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function getBal(req, res) {
  const response = await client.get(`bases-locales/${req.params.baseLocaleId}`)
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

app.get('/bases-locales/:baseLocaleId', w(getBal))

module.exports = app

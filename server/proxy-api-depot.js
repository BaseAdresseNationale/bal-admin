const express = require('express')
const got = require('got')

const w = require('./w')

const API_DEPOT_URL = process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme.adresse.data.gouv.fr/api-depot'
const {API_DEPOT_TOKEN} = process.env

const client = got.extend({
  prefixUrl: API_DEPOT_URL,
  headers: {
    authorization: `Token ${API_DEPOT_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function getClients(req, res) {
  const response = await client.get('clients')
  forward(response, res)
}

async function getMandataires(req, res) {
  const response = await client.get('mandataires')
  forward(response, res)
}

async function getChefsDeFile(req, res) {
  const response = await client.get('chefs-de-file')
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

// Clients
app.get('/clients', w(getClients))

// Mandataires
app.get('/mandataires', w(getMandataires))

// Chefs de file
app.get('/chefs-de-file', w(getChefsDeFile))

module.exports = app


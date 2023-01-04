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

async function createClient(req, res) {
  const response = await client.post('clients', {json: req.body})
  forward(response, res)
}

async function getClients(req, res) {
  const response = await client.get('clients')
  forward(response, res)
}

async function getClient(req, res) {
  const response = await client.get(`clients/${req.params.clientId}`)
  forward(response, res)
}

async function updateClient(req, res) {
  const response = await client.put(`clients/${req.params.clientId}`, {json: req.body})
  forward(response, res)
}

async function getMandataire(req, res) {
  const response = await client.get(`mandataires/${req.params.mandataireId}`)
  forward(response, res)
}

async function getMandataires(req, res) {
  const response = await client.get('mandataires')
  forward(response, res)
}

async function getChefDeFile(req, res) {
  const response = await client.get(`chefs-de-file/${req.params.chefDeFileId}`)
  forward(response, res)
}

async function getChefsDeFile(req, res) {
  const response = await client.get('chefs-de-file')
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

// Clients
app.post('/clients', w(createClient))
app.get('/clients', w(getClients))
app.get('/clients/:clientId', w(getClient))
app.put('/clients/:clientId', w(updateClient))

// Mandataires
app.get('/mandataires', w(getMandataires))
app.get('/mandataires/:mandataireId', w(getMandataire))

// Chefs de file
app.get('/chefs-de-file', w(getChefsDeFile))
app.get('/chefs-de-file/:chefDeFileId', w(getChefDeFile))

module.exports = app


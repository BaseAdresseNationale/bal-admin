const express = require('express')
const got = require('got')

const w = require('./w')

const API_DEPOT_URL = process.env.NEXT_PUBLIC_API_DEPOT_URL || 'https://plateforme-bal.adresse.data.gouv.fr/api-depot'
const API_DEPOT_DEMO_URL = process.env.NEXT_PUBLIC_API_DEPOT_DEMO_URL || 'https://plateforme-bal.adresse.data.gouv.fr/api-depot-demo'
const {API_DEPOT_TOKEN, API_DEPOT_DEMO_TOKEN} = process.env

const client = got.extend({
  prefixUrl: API_DEPOT_URL,
  headers: {
    authorization: `Token ${API_DEPOT_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

const clientDEMO = got.extend({
  prefixUrl: API_DEPOT_DEMO_URL,
  headers: {
    authorization: `Token ${API_DEPOT_DEMO_TOKEN}`
  },
  throwHttpErrors: false,
  responseType: 'json'
})

// Sélection du client
function handleClient(req, res, next) {
  req.client = req.demo === 1 ? clientDEMO : client
  next()
}

function forward(gotResponse, res) {
  res.status(gotResponse.statusCode).send(gotResponse.body)
}

async function createClient(req, res) {
  const response = await req.client.post('clients', {json: req.body})
  forward(response, res)
}

async function getClients(req, res) {
  const response = await req.client.get('clients')
  forward(response, res)
}

async function getClient(req, res) {
  const response = await req.client.get(`clients/${req.params.clientId}`)
  forward(response, res)
}

async function updateClient(req, res) {
  const response = await req.client.put(`clients/${req.params.clientId}`, {json: req.body})
  forward(response, res)
}

async function createMandataire(req, res) {
  const response = await req.client.post('mandataires', {json: req.body})
  forward(response, res)
}

async function getMandataire(req, res) {
  const response = await req.client.get(`mandataires/${req.params.mandataireId}`)
  forward(response, res)
}

async function getMandataires(req, res) {
  const response = await req.client.get('mandataires')
  forward(response, res)
}

async function createChefDeFile(req, res) {
  const response = await req.client.post('chefs-de-file', {json: req.body})
  forward(response, res)
}

async function getChefDeFile(req, res) {
  const response = await req.client.get(`chefs-de-file/${req.params.chefDeFileId}`)
  forward(response, res)
}

async function getChefsDeFile(req, res) {
  const response = await req.client.get('chefs-de-file')
  forward(response, res)
}

/*
  Retourne le nombre cumulé de première révision de BAL publiée pour chaque jours entre 'from' et 'to' inclus
  Exemple :
    Query : stats/firsts-publications?from=2023-03-12&to=2023-03-28

    Réponse :
    [{ date: '2023-03-12', totalCreations: 1000 }, { date: '2023-03-28', totalCreations: 1010 } ...]

    Si pas de paramètre from / to, la requête renvoit par défaut le mois dernier
*/
async function getStatFirstPublicationEvolution(req, res) {
  const {from, to} = req.query

  const response = await client.get(`stats/firsts-publications?from=${from}&to=${to}`)
  forward(response, res)
}

/*
  Retourne les BAL publiées pour chaque jours entre 'from' et 'to' inclus
  Exemple :
    Query : stats/publications?from=2023-03-12&to=2023-03-28

    Réponse :
    [{ date: '2023-03-12', publishedBAL: [ { _id: "2913923", codeCommune: "37003", numPublications: 3 }, { .... } ] }, { date: '2023-03-13', updatedBAL: [ {  } ] } ...]

    - numPublications est le nombre de fois que la BAL a été publiée dans le journée
    - On a besoin du code commune pour la répartition des BAL publiées par département

    Si pas de paramètre from / to, la requête renvoit par défaut le mois dernier
*/
async function getStatPublications(req, res) {
  const {from, to} = req.query

  const response = await client.get(`stats/publications?from=${from}&to=${to}`)
  forward(response, res)
}

async function getAllRevisionsByCommune(req, res) {
  const response = await req.client.get(`communes/${req.params.codeCommune}/revisions?status=all`)
  forward(response, res)
}

const app = new express.Router()

app.use(express.json())

// Ajoutez le middleware handleClient
app.use(handleClient)

// Clients
app.post('/clients', w(createClient))
app.get('/clients', w(getClients))
app.get('/clients/:clientId', w(getClient))
app.put('/clients/:clientId', w(updateClient))

// Mandataires
app.post('/mandataires', w(createMandataire))
app.get('/mandataires', w(getMandataires))
app.get('/mandataires/:mandataireId', w(getMandataire))

// Chefs de file
app.post('/chefs-de-file', w(createChefDeFile))
app.get('/chefs-de-file', w(getChefsDeFile))
app.get('/chefs-de-file/:chefDeFileId', w(getChefDeFile))

// Dashboard
app.get('/stats/firsts-publications', w(getStatFirstPublicationEvolution))
app.get('/stats/publications', w(getStatPublications))

app.get('/communes/:codeCommune/revisions', w(getAllRevisionsByCommune))

module.exports = app


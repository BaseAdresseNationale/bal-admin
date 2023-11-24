#!/usr/bin/env node
const express = require('express')
const next = require('next')
require('dotenv').config()
const mongoClient = require('./utils/mongo-client')
const {routeGuard} = require('./route-guard')

function setDemoClient(req, res, next) {
  req.demo = 1
  next()
}

async function main() {
  const server = express()

  const port = process.env.PORT || 9000
  const dev = process.env.NODE_ENV !== 'production'

  const nextApp = next({dev})
  const nextAppRequestHandler = nextApp.getRequestHandler()

  await nextApp.prepare()

  await mongoClient.connect()

  server.use(express.json({limit: '5mb'}))
  server.use(express.urlencoded({
    extended: true,
    limit: '5mb'
  }))

  // Proxy routes are protected by routeGuard
  server.use('/api/proxy-api-depot', routeGuard, require('./proxy-api-depot'))
  server.use('/api/proxy-api-depot-demo', routeGuard, setDemoClient, require('./proxy-api-depot'))
  server.use('/api/proxy-api-moissonneur-bal', routeGuard, require('./proxy-api-moissonneur-bal'))
  server.use('/api/proxy-mes-adresses-api', routeGuard, require('./proxy-mes-adresses-api'))

  // Some Partenaire de la charte routes are public, others are protected by routeGuard
  server.use('/api/partenaires-de-la-charte', require('./lib/partenaire-de-la-charte/controller'))
  server.use('/api/events', require('./lib/events/controller'))

  server.use(async (req, res) => {
    // Authentification is handled by the next app using next-auth module
    await nextAppRequestHandler(req, res)
  })

  server.listen(port, () => {
    console.log(`Start listening on port ${port}`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

#!/usr/bin/env node
const express = require('express')
const next = require('next')
require('dotenv').config()

const createApiRoutes = require('./routes')

async function main() {
  const server = express()

  const port = process.env.PORT || 9000
  const dev = process.env.NODE_ENV !== 'production'

  const nextApp = next({dev})
  await nextApp.prepare()

  server.use('/api', createApiRoutes())

  server.get('*', (req, res) => {
    nextApp.render(req, res, req.params[0], req.query)
  })

  server.listen(port, () => {
    console.log(`Start listening on port ${port}`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})

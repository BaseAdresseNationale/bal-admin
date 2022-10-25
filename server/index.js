const express = require('express')
const next = require('next')
const compression = require('compression')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use('/proxy-api-depot', require('./proxy-api-depot'))

  server.get('*', (request, res) => handle(request, res))

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})

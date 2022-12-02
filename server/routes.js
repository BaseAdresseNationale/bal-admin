const express = require('express')
const {ironSession} = require('iron-session/express')

function authSession(req, res, next) {
  if (req.session.user === undefined) {
    res.redirect('/login')
    return
  }

  next()
}

module.exports = app => {
  const router = new express.Router()

  router.use(express.json())

  router.use(ironSession({
    cookieName: 'bal-admin-session',
    ttl: 6 * 3600, // 6 heures
    password: process.env.IRON_SESSION_SECRET,
  }))

  router.post('/login', async (req, res) => {
    if (req.body.password === process.env.TOKEN_SECRET) {
      req.session.user = {isAdmin: true}
      await req.session.save()
      res.redirect('/')
      return
    }

    res.sendStatus(401)
  })

  router.get('/admin', async (req, res) => {
    res.send({isAdmin: Boolean(req.session.user)})
  })

  router.get('/logout', async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
  })

  router.get('/', authSession)
  router.get('/moissonneur-bal', authSession)
  router.get('/mes-adresses', authSession)
  router.get('/api-depot', authSession)

  router.use('/proxy-api-depot', require('./proxy-api-depot'))
  router.use('/proxy-api-moissonneur-bal', require('./proxy-api-moissonneur-bal'))

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}

const got = require('got')

async function routeGuard(req, res, next) {
  const nextAuthClient = got.extend({
    prefixUrl: process.env.NEXTAUTH_URL,
    headers: {
      cookie: req.headers.cookie
    },
    throwHttpErrors: false,
    responseType: 'json'
  })

  const response = await nextAuthClient.get('session')
  const session = response.body

  if (!session.user) {
    res.status(401).json({error: 'Unauthorized'})
    return
  }

  next()
}

module.exports = {routeGuard}

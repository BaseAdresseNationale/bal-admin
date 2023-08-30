function routeGuard(req, res, next) {
  if (req.session.user === undefined) {
    res.status(401).json({error: 'Unauthorized'})
    return
  }

  next()
}

module.exports = {routeGuard}

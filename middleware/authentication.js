const passport = require('../config/passport')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { User } = require('../models')

//  everyone authenticated
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ stauts: 'error', message: 'Unauthorized' })
    if (err) return next(err)
    next()
  })(req, res, next)
}

//  admin authenticated
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// user authenticated
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// current user authenticated
const authenticatedCurrentUser = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) return next()
  return res.status(403).json({
    status: 'error',
    message: 'user can only edit own data'
  })
}

// socket user authenticated
const authenticatedSocket = (socket, next) => {
  try {
    const token = socket.handshake.headers.auth || socket.handshake.auth.token
    if (!token) return next(new Error('socket驗證錯誤!'))

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) return next(new Error('socket驗證錯誤!'))

      socket.user = await User.findByPk(decoded.id, {
        raw: true,
        attributes: ['id', 'name', 'account', 'avatar']
      })
      next()
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  authenticatedCurrentUser,
  authenticatedSocket
}

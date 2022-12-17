if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')

const passport = require('./config/passport')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const httpServer = require('http').createServer(app)
const socket = require('./config/socket')
const socketEvents = require('./socket')

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())

//  設定socketio server
const io = socket.initialize(httpServer)
socketEvents(io)

app.use(routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app

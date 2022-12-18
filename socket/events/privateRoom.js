const messageController = require('../../controllers/message.controller')

module.exports = (io, socket) => {
  socket.on('message', data => {
    console.log(data)
    socket.emit('message', data)
  })
}

module.exports = {
  initialize (httpServer) {
    return require('socket.io')(httpServer, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://localhost:8000'
        ],
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true //  Socket.IO v3相容v2 clients
    })
  }
}

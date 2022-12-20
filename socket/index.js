const { authenticatedSocket } = require('../middleware/authentication')
const privateRoom = require('./events/privateRoom')

module.exports = io => {
  /* 監聽連線狀態 */
  io.use(authenticatedSocket).on('connection', async socket => {
    const clientsCount = io.engine.clientsCount // 獲取當前連接的客戶端數量
    const user = socket.user
    console.log(
      ` ${user.name} connected and number of connections ${clientsCount}`
    )

    //  加入id，用於接收私人訊息未讀通知
    socket.join(socket.user.id)
    privateRoom(io, socket)
  })
}

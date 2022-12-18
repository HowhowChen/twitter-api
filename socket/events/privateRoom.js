const messageController = require('../../controllers/message.controller')

module.exports = (io, socket) => {
  //  一進單人聊天室就讀取歷史訊息
  socket.on('getPrivateMessage', async data => {
    try {
      const { receicerId } = data
      const senderId = socket.user.id

      //  回傳一個陣列， 讀取訊息在[1]
      const privateMessage = await Promise.all([
        messageController.putPrivateMessageStatus(senderId, receicerId),
        messageController.getPrivateMessages(senderId, receicerId)
      ])

      socket.emit('getPrivateMessage', privateMessage[1])
    } catch (err) {
      socket.on('error', err)
    }
  })

  //  點擊送出訊息，存進資料庫，回傳新增訊息給前端appendChild
  socket.on('postPrivateMessage', async data => {
    try {
      const { receicerId, content } = data
      const senderId = socket.user.id

      const postPrivateMessage = await messageController.postPrivateMessage(senderId, receicerId, content)

      socket.emit('getPrivateMessage', postPrivateMessage)
    } catch (err) {
      socket.on('error', err)
    }
  })

  //  列表讀取最後一筆訊息及未讀數量
  socket.on('privateMessageList', async data => {
    try {
      const receicerIdList = data
      const senderId = socket.user.id

      //  列表讀取最後一筆訊息及未讀數量
      const privateMessageList = await Promise.all(receicerIdList.map(async receicerId => (
        await messageController.getPrivateUnreadMessageCount(senderId, receicerId.receicerId)
      )))

      socket.emit('privateMessageList', privateMessageList)
    } catch (err) {
      socket.on('error', err)
    }
  })
}

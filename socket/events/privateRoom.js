const messageController = require('../../controllers/message.controller')
const { simplifyMessageTime, detailMessageTime, messageNowDay, nowDay } = require('../../helpers/date-helper')
const crypto = require('crypto')

module.exports = (io, socket) => {
  //  一進單人聊天室就讀取歷史訊息及加入roomId
  socket.on('joinRoom', async data => {
    try {
      const { receiverId, account } = data
      const senderId = socket.user.id

      // 建立rooId，做雜湊確保roomId不重複
      const senderAccount = socket.user.account
      const name = [account, senderAccount]
      name.sort()
      const roomId = crypto.createHash('md5').update(name[0] + name[1]).digest('hex')
      socket.join(roomId)

      //  回傳一個陣列， 讀取訊息在[1]
      const privateMessage = await Promise.all([
        messageController.putPrivateMessageStatus(senderId, receiverId), // 已讀所有訊息
        messageController.getPrivateMessages(senderId, receiverId)
      ])

      //  message時間轉換
      const newPrivateMessage = privateMessage[1].map(message => {
        switch (messageNowDay(message.createdAt)) {
          case nowDay():
            return {
              ...message,
              createdAt: simplifyMessageTime(message.createdAt)
            }
          default:
            return {
              ...message,
              createdAt: detailMessageTime(message.createdAt)
            }
        }
      })

      socket.emit('joinRoom', newPrivateMessage)
    } catch (err) {
      socket.on('error', err)
    }
  })

  //  點擊送出訊息，存進資料庫，回傳新增訊息給前端appendChild
  socket.on('sendMessage', async data => {
    try {
      const { receiverId, account, content } = data
      const senderId = socket.user.id

      // 建立rooId，做雜湊確保roomId不重複
      const senderAccount = socket.user.account
      const name = [account, senderAccount]
      name.sort()
      const roomId = crypto.createHash('md5').update(name[0] + name[1]).digest('hex')

      const postPrivateMessage = await messageController.postPrivateMessage(senderId, receiverId, content)
      const receiverUnreadMessage = await messageController.getAllUnreadPrivateMessage(receiverId)

      io.in(roomId).emit('receiveMessage', postPrivateMessage)

      //  寄送所有私人訊息未讀通知
      io.in(receiverId).emit('privateMessageNotify', { unreadMessage: receiverUnreadMessage })
    } catch (err) {
      socket.on('error', err)
    }
  })

  //  列表讀取最後一筆訊息及未讀數量
  socket.on('privateMessageList', async data => {
    try {
      const receiverIdList = data
      const senderId = socket.user.id

      //  列表讀取最後一筆訊息及未讀數量
      const privateMessageList = await Promise.all(receiverIdList.map(async receiverId => (
        await messageController.getPrivateUnreadMessageCount(senderId, receiverId.receiverId)
      )))

      socket.emit('privateMessageList', privateMessageList)
    } catch (err) {
      socket.on('error', err)
    }
  })

  //  離開聊天室，斷開socket房間連線
  socket.on('leaveRoom', async data => {
    // 建立rooId，做雜湊確保roomId不重複
    const { account } = data
    const senderAccount = socket.user.account
    const name = [account, senderAccount]
    name.sort()
    const roomId = crypto.createHash('md5').update(name[0] + name[1]).digest('hex')
    socket.leave(roomId)
  })
}

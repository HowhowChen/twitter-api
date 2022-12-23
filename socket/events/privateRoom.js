const messageController = require('../../controllers/message.controller')
const { messageTime, messageListTime } = require('../../helpers/date-helper')
const { socketErrorHandler } = require('../../middleware/error-handler')
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

      if (privateMessage[1].length === 0) throw new Error('使用者不存在!')

      //  message時間轉換
      const newPrivateMessage = privateMessage[1].map(message => ({
        ...message,
        createdAt: messageTime(message.createdAt)
      }))

      //  傳送聊天歷史訊息
      socket.emit('joinRoom', newPrivateMessage)
    } catch (err) {
      socketErrorHandler(err, socket)
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

      //  message時間轉換
      const newPostPrivateMessage = {
        ...postPrivateMessage.toJSON(),
        createdAt: messageTime(postPrivateMessage.createdAt)
      }

      //  將儲存至資料庫後的訊息，傳送給sender與receiver
      io.in(roomId).emit('receiveMessage', newPostPrivateMessage)

      //  傳送所有私人訊息未讀通知
      io.in(receiverId).emit('privateMessageNotify', { unreadMessage: receiverUnreadMessage })
    } catch (err) {
      socketErrorHandler(err, socket)
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

      //  message時間轉換
      const newPrivateMessageList = privateMessageList.map(message => ({
        ...message,
        createdAt: messageListTime(message.createdAt)
      }))

      //  傳送聊天列表
      socket.emit('privateMessageList', newPrivateMessageList)
    } catch (err) {
      socketErrorHandler(err, socket)
    }
  })

  //  離開聊天室，斷開socket房間連線
  socket.on('leaveRoom', async data => {
    try {
      // 建立rooId，做雜湊確保roomId不重複
      const { account } = data
      const senderAccount = socket.user.account
      const name = [account, senderAccount]
      name.sort()
      const roomId = crypto.createHash('md5').update(name[0] + name[1]).digest('hex')

      //  斷開socket房間連線
      socket.leave(roomId)
    } catch (err) {
      socketErrorHandler(err, socket)
    }
  })

  //  定期傳送未讀訊息總數(上線的這位使用者)
  socket.on('privateMessageNotify', async data => {
    try {
      const { id } = socket.user
      const receiverUnreadMessage = await messageController.getAllUnreadPrivateMessage(id)

      //  傳送所有私人訊息未讀通知
      io.in(id).emit('privateMessageNotify', { unreadMessage: receiverUnreadMessage })
    } catch (err) {
      socketErrorHandler(err, socket)
    }
  })
}

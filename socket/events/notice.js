const messageController = require('../../controllers/message.controller')

module.exports = (io, socket) => {
  socket.on('updateNotice', async () => {
    const currentUserId = socket.user.id
    const [newTweetNotices, likeNotice, replyNotice, followNotice] = await messageController.getAllNotices(currentUserId)
    const concatNotices = newTweetNotices.concat(likeNotice, replyNotice, followNotice)

    // 如果有訊息更新，利用建立時間排序
    if (concatNotices.length !== 0) {
      concatNotices.sort((a, b) => b.createdAt - a.createdAt)
      socket.emit('updateNotice', concatNotices)
    }
  })
}

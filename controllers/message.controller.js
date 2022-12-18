const { PrivateChat, sequelize } = require('../models')
const { Op } = require('sequelize')

const messageController = {
  getPrivateMessages: async (senderId, receiverId) => {
    const getPrivateMessage = await PrivateChat.findAll({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                senderId: senderId
              },
              {
                receiverId: receiverId
              }
            ]
          },
          {
            [Op.and]: [
              {
                senderId: receiverId
              },
              {
                receiverId: senderId
              }
            ]
          }
        ]
      },
      raw: true,
      nest: true,
      order: [['id', 'ASC']]
    })
    return getPrivateMessage
  },
  postPrivateMessage: async (senderId, receiverId, content) => {
    const postPrivateMessage = await PrivateChat.create({
      senderId,
      receiverId,
      content
    })

    return postPrivateMessage
  },
  putPrivateMessageStatus: async (senderId, receiverId) => {
    await PrivateChat.update(
      { isRead: false },
      {
        where: {
          senderId: receiverId,
          receiverId: senderId
        }
      }
    )
  },
  getPrivateUnreadMessageCount: async (senderId, receiverId) => {
    return await PrivateChat.findOne({
      attributes: [
        'senderId', 'receiverId', 'content', 'isRead', 'createdAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM PrivateChats WHERE senderId = ${receiverId} AND receiverId = ${senderId} AND isRead = false)`), 'unReadCount']
      ],
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                senderId: senderId
              },
              {
                receiverId: receiverId
              }
            ]
          },
          {
            [Op.and]: [
              {
                senderId: receiverId
              },
              {
                receiverId: senderId
              }
            ]
          }
        ]
      },
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })
  }
}

module.exports = messageController

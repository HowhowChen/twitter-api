'use strict'
const faker = require('faker')
const { MSG_PER_USER_PER_ROOM } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const messages = []
    const users = await queryInterface.sequelize.query('SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    users.forEach(sender => {
      users.forEach(receiver => {
        if (sender.id !== receiver.id) {
          messages.push(
            ...Array.from({ length: MSG_PER_USER_PER_ROOM }, () => ({
              senderId: sender.id,
              receiverId: receiver.id,
              content: faker.lorem.sentences(1),
              isRead: false,
              createdAt: new Date(),
              updatedAt: new Date()
            }))
          )
        }
      })
    })
    await queryInterface.bulkInsert('PrivateChats', messages)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PrivateChats', { })
  }
}

'use strict'
const { GROUP_CHAT_AMOUNT } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Rooms', [{
      name: 'Public Chatroom',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ...Array.from({ length: GROUP_CHAT_AMOUNT }, (_, i) => ({
      name: `room${i + 1}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rooms', { })
  }
}

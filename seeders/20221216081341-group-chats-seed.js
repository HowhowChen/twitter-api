'use strict'
const faker = require('faker')
const { MSG_PER_USER_PER_ROOM } = require('../helpers/seeder-helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const messages = []
    const userRooms = await queryInterface.sequelize.query(
      'SELECT `UserId`, `RoomId` FROM `UserRooms`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    userRooms.forEach(userRoom => {
      messages.push(...Array.from({ length: MSG_PER_USER_PER_ROOM }, () => ({
        UserId: userRoom.UserId,
        RoomId: userRoom.RoomId,
        content: faker.lorem.sentences(1),
        createdAt: new Date(),
        updatedAt: new Date()
      })))
    })
    await queryInterface.bulkInsert('GroupChats', messages)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GroupChats', { })
  }
}

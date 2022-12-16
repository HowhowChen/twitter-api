'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRooms = []
    const rooms = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Rooms`;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query('SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    rooms.forEach(room => {
      const userIdInRoom = []
      do {
        users.forEach((user, i) => {
          if (Math.random() < 0.5) {
            userIdInRoom.push(i)
          }
        })
      } while (userIdInRoom.length < 2)
      userRooms.push(
        ...Array.from({ length: userIdInRoom.length }, (_, i) => ({
          UserId: users[userIdInRoom[i]].id,
          RoomId: room.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      )
    })
    await queryInterface.bulkInsert('UserRooms', userRooms)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRooms', {})
  }
}

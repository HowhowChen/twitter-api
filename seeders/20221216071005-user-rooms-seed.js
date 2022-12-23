'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userRooms = []
    const publicRoom = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Rooms` WHERE `name` = "Public Chatroom";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    console.log(publicRoom[0].id)
    const groupRooms = await queryInterface.sequelize.query(
      'SELECT `id` FROM `Rooms` WHERE `name` != "Public Chatroom";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const users = await queryInterface.sequelize.query('SELECT `id` FROM `Users` WHERE `role` = "user";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    users.forEach(user => {
      userRooms.push({
        UserId: user.id,
        RoomId: publicRoom[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })

    groupRooms.forEach(room => {
      const userIdInRoom = []
      do {
        users.forEach(user => {
          if (Math.random() < 0.5 && !userIdInRoom.includes(user.id)) {
            userIdInRoom.push(user.id)
          }
        })
      } while (userIdInRoom.length < 3)
      userRooms.push(
        ...Array.from({ length: userIdInRoom.length }, (_, i) => ({
          UserId: users[i].id,
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

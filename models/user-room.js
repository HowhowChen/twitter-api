'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserRoom extends Model {
    static associate (models) {
      UserRoom.belongsTo(models.User, { foreignKey: 'UserId' })
      UserRoom.belongsTo(models.Room, { foreignKey: 'RoomId' })
    }
  }
  UserRoom.init(
    {
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'UserRoom',
      tableName: 'UserRooms'
    }
  )
  return UserRoom
}

'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate (models) {
      Room.hasMany(models.UserRoom, { foreignKey: 'RoomId' })
      Room.hasMany(models.GroupChat, { foreignKey: 'RoomId' })
    }
  }
  Room.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'Rooms'
    }
  )
  return Room
}

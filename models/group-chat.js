'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class GroupChat extends Model {
    static associate (models) {
      GroupChat.belongsTo(models.User, { foreignKey: 'UserId' })
      GroupChat.belongsTo(models.Room, { foreignKey: 'RoomId' })
    }
  }
  GroupChat.init(
    {
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER,
      content: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'GroupChat',
      tableName: 'GroupChats'
    }
  )
  return GroupChat
}

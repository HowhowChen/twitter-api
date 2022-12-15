'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate (models) {
    //   Room.hasMany(models.Reply, { foreignKey: 'TweetId' })
    //   Room.hasMany(models.Like, { foreignKey: 'TweetId' })
    //   Room.belongsTo(models.User, { foreignKey: 'UserId' })
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

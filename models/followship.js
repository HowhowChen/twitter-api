'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class FollowShip extends Model {
    static associate (models) {
      FollowShip.belongsTo(models.User, { foreignKey: 'followerId', as: 'Followers' })
      FollowShip.belongsTo(models.User, { foreignKey: 'followingId', as: 'Followings' })
      FollowShip.hasOne(models.FollowNotice, { foreignKey: 'FollowshipId' })
    }
  }
  FollowShip.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Followship',
      tableName: 'Followships'
    }
  )
  return FollowShip
}

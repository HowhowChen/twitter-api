'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class FollowNotice extends Model {
    static associate (models) {
      FollowNotice.belongsTo(models.User, { foreignKey: 'followerId', as: 'Followers' })
      FollowNotice.belongsTo(models.User, { foreignKey: 'followingId', as: 'Followings' })
    }
  }
  FollowNotice.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      title: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'FollowNotice',
      tableName: 'FollowNotices'
    }
  )
  return FollowNotice
}

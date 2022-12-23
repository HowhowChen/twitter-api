'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class LikeNotice extends Model {
    static associate (models) {
      LikeNotice.belongsTo(models.User, { foreignKey: 'UserId' })
      LikeNotice.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  LikeNotice.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      title: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'LikeNotice',
      tableName: 'LikeNotices'
    }
  )
  return LikeNotice
}

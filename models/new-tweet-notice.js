'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class NewTweetNotice extends Model {
    static associate (models) {
      NewTweetNotice.belongsTo(models.Subscribe, { foreignKey: 'SubscribeId' })
      NewTweetNotice.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  }
  NewTweetNotice.init(
    {
      SubscribeId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      title: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'NewTweetNotice',
      tableName: 'NewTweetNotices'
    }
  )
  return NewTweetNotice
}

'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    static associate (models) {
      Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
      Tweet.belongsTo(models.User, { foreignKey: 'UserId' })
      Tweet.hasMany(models.NewTweetNotice, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.LikeNotice, { foreignKey: 'TweetId' })
      Tweet.hasMany(models.ReplyNotice, { foreignKey: 'TweetId' })
    }
  }
  Tweet.init(
    {
      UserId: DataTypes.INTEGER,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Tweet',
      tableName: 'Tweets'
    }
  )
  return Tweet
}

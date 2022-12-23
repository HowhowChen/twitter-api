'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class ReplyNotice extends Model {
    static associate (models) {
      ReplyNotice.belongsTo(models.User, { foreignKey: 'UserId' })
      ReplyNotice.hasOne(models.Reply, { foreignKey: 'ReplyId' })
    }
  }
  ReplyNotice.init(
    {
      UserId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      title: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'ReplyNotice',
      tableName: 'ReplyNotices'
    }
  )
  return ReplyNotice
}

'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    static associate (models) {
      Subscribe.belongsTo(models.User, { foreignKey: 'subscriberId', as: 'Subscribers' })
      Subscribe.belongsTo(models.User, { foreignKey: 'subscribingId', as: 'Subscribings' })
    }
  }
  Subscribe.init(
    {
      subscriberId: DataTypes.INTEGER,
      subscribingId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Subscribe',
      tableName: 'Subscribes'
    }
  )
  return Subscribe
}

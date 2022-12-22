'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Suscribe extends Model {
    static associate (models) {
      Suscribe.belongsTo(models.User, { foreignKey: 'suscriberId', as: 'Suscribers' })
      Suscribe.belongsTo(models.User, { foreignKey: 'suscribingId', as: 'Suscribings' })
    }
  }
  Suscribe.init(
    {
      suscriberId: DataTypes.INTEGER,
      suscribingId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Suscribe',
      tableName: 'Suscribe'
    }
  )
  return Suscribe
}

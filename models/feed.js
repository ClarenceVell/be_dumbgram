'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      feed.belongsTo(models.user, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  feed.init({
    fileName: DataTypes.STRING,
    caption: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    like: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'feed',
  });
  return feed;
};
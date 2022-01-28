'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      follow.belongsTo(models.user, {
        as: 'follower',
        foreignKey: {
          name: 'followers'
        }
      })

      follow.belongsTo(models.user, {
        as: 'following',
        foreignKey: {
          name: 'followings'
        }
      })
    }
  }
  follow.init({
    followers: DataTypes.INTEGER,
    followings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'follow',
  });
  return follow;
};
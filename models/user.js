'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      user.hasMany(models.follow, {
        as: 'following',
        foreignKey: {
          name: 'followers'
        }
      })

      user.hasMany(models.follow, {
        as: 'follower',
        foreignKey: {
          name: 'followings'
        }
      })

      // user.hasMany(models.messages, {
      //   as: 'Receiver',
      //   foreignKey: {
      //     name: 'receiver'
      //   }
      // })

      // user.hasMany(models.messages, {
      //   as: 'Sender',
      //   foreignKey: {
      //     name: 'sender'
      //   }
      // })

      user.hasMany(models.feed, {
        as: 'feed',
        foreignKey: {
          name: 'userFeed'
        }
      })
    }
  }
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
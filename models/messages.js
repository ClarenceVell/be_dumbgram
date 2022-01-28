'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      messages.belongsTo(models.user, {
        as: 'Receiver',
        foreignKey: {
          name: 'receiver'
        }
      })

      messages.belongsTo(models.user, {
        as: 'Sender',
        foreignKey: {
          name: 'sender'
        }
      })
    }
  }
  messages.init({
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'messages',
  });
  return messages;
};
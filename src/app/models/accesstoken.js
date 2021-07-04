'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accesstoken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: {
          allowNull: false,
          name: 'user_id'
        }
      })
    }
  };
  accesstoken.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'accesstoken',
  });
  return accesstoken;
};
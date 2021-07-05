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
      // define association here

      this.hasOne(models.accesstoken, {
        foreignKey: 'user_id'
      })

      this.hasMany(models.todo_list, {
        foreignKey:'user_id'
      })
    }
  };
  user.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    auth_token: {
      type: DataTypes.STRING
    },
    password_reset_token:{
      type: DataTypes.STRING
    },
    last_login: {
      type: DataTypes.DATE
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'user',
  });
  return user;
};
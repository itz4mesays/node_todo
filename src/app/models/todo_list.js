'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo_list extends Model {
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
  todo_list.init({
    user_id: {
      type: DataTypes.INTEGER
    },
    todo_title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    todo_description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    todo_type: {
      allowNull: false,
      type: DataTypes.ENUM("Draft", "Published")
    },
    todo_status: {
      allowNull: false,
      type: DataTypes.ENUM("Pending", "In Progress", "Completed", "Canceled"),
    },
    start_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    end_date: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'todo_list',
  });
  return todo_list;
};
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('todo_list', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      todo_title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      todo_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      todo_type: {
        type: Sequelize.ENUM("Draft", "Published"),
        allowNull: false,
        defaultValue: "Published"
      },
      todo_status: {
        type: Sequelize.ENUM("Pending", "In Progress", "Completed", "Canceled"),
        defaultValue: "Pending",
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('todo_list');
  }
};
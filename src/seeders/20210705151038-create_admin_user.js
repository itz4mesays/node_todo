'use strict';

const db = require('../app/models')
const User = db.rest.models.user
const bcrypt = require('bcrypt')
const jsonData = require('../data/data.json')
let role = jsonData.roles

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    role = role.filter((result) => {
      return result.slug == "admin"
    })

    const salt = await bcrypt.genSalt()
    const password = await bcrypt.hash('welcome123', salt)

    return queryInterface.bulkInsert('user', [{
      username: 'oyedele.phemy',
      password: password,
      email: 'oyedele.phemy@gmail.com',
      role: role[0].slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user', null, {});
  }
};

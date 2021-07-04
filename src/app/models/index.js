require('dotenv').config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
// const env = process.env.NODE_ENV || 'production' //for production
const config = require('../../config/config')[env]

let db = {};

const databases = Object.keys(config.databases)

for (let i = 0; i < databases.length; i++) {
  let database = databases[i]
  let dbPath = config.databases[database]

  db[database] = new Sequelize(
    dbPath.database,
    dbPath.username,
    dbPath.password,
    dbPath
  )

}

//Add the Database Models
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    let model = db.rest.import(path.join(__dirname, file))
    db[model.name] = model;
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db
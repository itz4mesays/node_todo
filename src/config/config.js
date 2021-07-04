require('dotenv').config()

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_NAME_TEST } = process.env

module.exports = {
  development: {
    databases: {
      rest: {
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 5,
          min: 0,
          idle: 20000
        }

      }
    }
  },
  local: {
    databases: {
      rest: {
        database: '',
        username: 'root',
        password: '',
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        pool: {
          max: 5,
          min: 0,
          idle: 20000
        }

        // logging: false,
      }
    }
  },
  production: {
    databases: {
      rest: {
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 5,
          min: 0,
          idle: 20000
        }

      }
    }
  }
}
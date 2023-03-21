require('dotenv').config()

module.exports = {
  development: {
    username: 'admin',
    password: 'password',
    database: 'ac_twitter_workspace',
    host: 'localhost',
    dialect: 'postgres'
  },
  test: {
    username: 'admin',
    password: 'password',
    database: 'ac_twitter_workspace_test',
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_CHOOSE,
    dialectOptions: {
      ssl: true
    },
    logging: false
  },
  travis: {
    username: 'travis',
    database: 'ac_twitter_workspace_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
}

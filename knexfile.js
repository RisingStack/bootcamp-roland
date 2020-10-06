// Update with your config settings.

const path = require('path');

const config = require('./config');

module.exports = {
  client: 'pg',
  connection: {
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.db,
  },
  migrations: {
      directory: './db/migrations'
  },
  seeds: {
      directory: './db/seeds'
  }
};

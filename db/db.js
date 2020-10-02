const path = require('path');

const config = require('../config');
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.db,
    },
    migrations: {
        directory: path.join(__dirname, './migrations')
    },
    seeds: {
        directory: path.join(__dirname, './seeds')
    }
});

module.exports = knex;

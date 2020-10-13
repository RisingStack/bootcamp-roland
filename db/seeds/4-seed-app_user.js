const bcryp = require('bcrypt');

function seed(knex) {
    return knex('app_user').insert(
        { username: 'test', password: bcryp.hashSync('1test2',12)});
};

module.exports = { seed };

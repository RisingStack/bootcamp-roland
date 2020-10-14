const db = require('../db');

insert = user => db('app_user').insert(user);

read = username => db('app_user').where({username}).select('password');

module.exports = {
    insert,
    read
};

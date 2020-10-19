const db = require('../db');

const insert = user => db('app_user').insert(user);

const read = username => db('app_user').where({ username }).select('password');

module.exports = {
  insert,
  read,
};

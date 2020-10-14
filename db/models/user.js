const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
    login: Joi.string().required(),
    avatar_url: Joi.string().uri(),
    html_url: Joi.string().uri(),
});

const insert = data => db('user').insert(data);

const read = (param = { id, login } = {}) => db('user').where(param).select();

module.exports = {
    insert,
    read,
    schema
};

const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
    login: Joi.string().required(),
    avatar_url: Joi.string().uri(),
    html_url: Joi.string().uri(),
});

async function insert(data) {
    const response = await db('user').insert(data);
    return response;
}

async function read(param = { id, login } = {}) {
    const response = await db('user').where(param).select();
    return response;
}

module.exports = {
    insert,
    read,
    schema
};
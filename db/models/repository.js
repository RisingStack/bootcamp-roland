const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
    owner: Joi.number().integer().required(),
    full_name: Joi.string().required(),
    stargazers_count: Joi.number().integer().required(),
    html_url: Joi.string().uri({ scheme: 'https://github.com' }).required(),
    description: Joi.string(),
    language: Joi.string()
});

async function insert(data) {
    const response = await db('repository').insert(data);
    return response;
}

async function read(params = { id, full_name } = {}) {
    const response = await db('repsitory').where(params).select();
    return response;
}

module.exports = {
    insert,
    read,
    schema
};
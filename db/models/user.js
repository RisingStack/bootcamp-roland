const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
    login: Joi.string().required(),
    avatar_url: Joi.string().uri(),
    html_url: Joi.string().uri(),
});

async function insert(data) {
    try {
        Joi.assert(data, schema);
        const response = await db('user').insert(data);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function read(param = { id, login } = {}) {
    const response = await db('user').where(param).select();
    if (!response.length) return `No result for ${JSON.stringify(param)}`;
    return response;
}

module.exports = {
    insert,
    read,
    schema
};
const Joi = require('joi');
const db = require('../db');

const User = Joi.object({
    id: Joi.number().required(),
    login: Joi.string().required(),
    avatar_url: Joi.string(),
    html_url: Joi.string(),
    type: Joi.string()
});

async function insert(data) {
    console.log(data);
    Joi.assert(data, User);

    try {
        const response = await db('user').insert(data);
        return response;
    } catch (err) {
        return err.detail;
    }
}

async function read({ id, login }) {
    if (!id && !login) throw 'No parameters given!';
    const param = id ? { id } : { login };

    return await db('user').where(param).select();
}

module.exports = {
    insert,
    read
};
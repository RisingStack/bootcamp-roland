const Joi = require('joi');
const { schema } = require('../db');
const db = require('../db');

const User = Joi.object({
    id: Joi.number().integer().required(),
    login: Joi.string().required(),
    avatar_url: Joi.string().uri({scheme: 'https://github.com'}),
    html_url: Joi.string().uri({scheme: 'https://github.com'}),
    type: Joi.string()
});

async function insert(data) {
    console.log(data);
    
    try {
        Joi.assert(data, User);
        const response = await db('user').insert(data);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function read({ id, login }) {
    if (!id && !login) throw 'No parameters given!';
    const param = id ? { id } : { login };

    const response = await db('user').where(param).select();
    if (!response.length) return `No result for ${JSON.stringify(param)}`;
    return response;
}

module.exports = {
    insert,
    read
};
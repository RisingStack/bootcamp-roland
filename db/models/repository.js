const Joi = require('joi');
const db = require('../db');

const Repository = Joi.object({
    id: Joi.number().integer().required(),
    owner: Joi.number().integer().required(),
    full_name: Joi.string().required(),
    stargazers_count: Joi.number().integer().required(),
    html_url: Joi.string().uri({scheme: 'https://github.com'}).required(),
    description: Joi.string(),
    language: Joi.string()
});

async function insert(data) {
    console.log(data);
    
    try {
        Joi.assert(data, Repository);
        const response = await db('repository').insert(data);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function read({ id, full_name }) {
    if (!id && !full_name) throw 'No parameters given!';
    const param = id ? { id } : { full_name };

    const response = await db('repository').where(param).select();
    if (!response.length) return `No result for ${JSON.stringify(param)}`;
    return response;
}

module.exports = {
    insert,
    read
};
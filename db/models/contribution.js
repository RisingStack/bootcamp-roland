const Joi = require('joi');
const db = require('../db');

const Contribution = Joi.object({
    user: Joi.number().required(),
    repository: Joi.number().required(),
    line_count: Joi.number().required(),
});

async function insert(data) {
    console.log(data);
    
    try {
        Joi.assert(data, Repository);
        const response = await db('contribution').insert(data);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function insertOrReplace({repository, user, line_count}){
    Joi.assert({repository, user, line_count}, Contribution);
    const response = await db.raw(`
        INSERT INTO contribution ("user",repository,line_count) 
        VALUES (${user}, ${repository}, ${line_count})
        ON CONFLICT ("user", repository) DO UPDATE SET "user"=EXCLUDED."user", repository=EXCLUDED.repository, line_count=EXCLUDED.line_count
    `);
    return response;
}

async function read({user: {id: userID, login}, repository: {id: repositoryId, full_name}}){
    const tables = [];
    if(user){}
}

module.exports = {
    insert,
    insertOrReplace,
};
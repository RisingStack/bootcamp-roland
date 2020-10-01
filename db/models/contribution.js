const Joi = require('joi');
const db = require('../db');
const _ = require('lodash');

const schema = Joi.object({
    user: Joi.number().integer().required(),
    repository: Joi.number().integer().required(),
    line_count: Joi.number().integer().required(),
});

async function insert(data) {
    const response = await db('contribution').insert(data);
    return response;
}

async function insertOrReplace({ repository, user, line_count }) {
    Joi.assert({ repository, user, line_count }, schema);
    const response = await db.raw(`
        INSERT INTO contribution ("user",repository,line_count) 
        VALUES (:user, :repository, :line_count)
        ON CONFLICT ("user", repository) DO UPDATE SET line_count=:line_count
    `, { user, repository, line_count });
    return response;
}

async function read(params) {
    const { user = {}, repository = {} } = params;

    const queryParams = _.omitBy({
        'user.id': user.id,
        'user.login': user.login,
        'repository.id': repository.id,
        'repository.full_name': repository.fullName
    }, (param) => _.isNil(param));

    const response = await db.select('contribution.user', 'contribution.repository', 'line_count', 'full_name', 'login')
        .from('contribution')
        .leftJoin('user', 'contribution.user', 'user.id')
        .leftJoin('repository', 'contribution.repository', 'repository.id')
        .where(queryParams);

    const mappedResponse = _.map(response, ({ user: userID, repository: repoID, line_count, full_name, login }) => {
        const user = { id: userID, login };
        const repository = { id: repoID, full_name };
        return {
            line_count,
            user,
            repository,
        };
    });

    return mappedResponse;
}

module.exports = {
    insert,
    insertOrReplace,
    read,
    schema
};

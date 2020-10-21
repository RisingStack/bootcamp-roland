const Joi = require('joi');
const _ = require('lodash');

const db = require('../db');

const schema = Joi.object({
  user: Joi.number().integer().required(),
  repository: Joi.number().integer().required(),
  lineCount: Joi.number().integer().required(),
});

const insert = (data) => db('contribution').insert(data);

async function insertOrReplace({ repository, user, lineCount }) {
  Joi.assert({ repository, user, lineCount }, schema);
  const response = await db.raw(`
        INSERT INTO contribution ("user",repository,line_count) 
        VALUES (:user, :repository, :line_count)
        ON CONFLICT ("user", repository) DO UPDATE SET line_count=:line_count
    `, { user, repository, line_count: lineCount });
  return response;
}

async function read(params) {
  const { user = {}, repository = {} } = params;

  const queryParams = _.omitBy({
    'user.id': user.id,
    'user.login': user.login,
    'repository.id': repository.id,
    'repository.full_name': repository.fullName,
  }, (param) => _.isNil(param));

  const response = await db.select('contribution.user', 'contribution.repository', 'line_count', 'full_name', 'login')
    .from('contribution')
    .leftJoin('user', 'contribution.user', 'user.id')
    .leftJoin('repository', 'contribution.repository', 'repository.id')
    .where(queryParams);

  const mappedResponse = _.map(response,
    ({
      user: userID, repository: repoID, line_count: lineCount, full_name: fullName, login,
    }) => (
      {
        lineCount,
        user: { id: userID, login },
        repository: { id: repoID, fullName },
      }
    ));

  return mappedResponse;
}

module.exports = {
  insert,
  insertOrReplace,
  read,
  schema,
};

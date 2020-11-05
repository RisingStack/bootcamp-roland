const Joi = require('joi');

const { searchRepositories } = require('../../services/github');
const repositoryModel = require('../../db/models/repository');
const userModel = require('../../db/models/user');
const logger = require('../../logger');

const searchRepositoriesResponseSchema = Joi.array().has(Joi.object({
  node: Joi.object().keys({
    owner: Joi.object().required(),
    name: Joi.string().required(),
    description: Joi.string().allow('').required(),
    homepageUrl: Joi.string().allow('').required(),
    stargazerCount: Joi.number().required(),
    languages: Joi.object().required(),
    createdAt: Joi.string().required(),
  }).required(),
}));

const onRepository = async (message) => {
  const { search: { edges } } = await searchRepositories({ queryString: message, first: 1 });

  Joi.assert(edges, searchRepositoriesResponseSchema);

  const repository = edges[0].node;
  const { owner } = repository;

  logger.info(JSON.stringify(edges[0].node, null, '-'));

  const user = {
    login: owner.login,
    avatar_url: owner.avatarUrl,
    html_url: owner.url,
  };

  logger.info(JSON.stringify(user));

  Joi.assert(user, userModel.schema);

  let insertedUser = await userModel.read(user);

  if (!insertedUser.length) {
    insertedUser = await userModel.insert(user);
  }

  logger.info(JSON.stringify(repository));

  const formatedRepository = {
    owner: insertedUser[0].id,
    full_name: repository.name,
    stargazers_count: repository.stargazerCount,
    html_url: repository.homepageUrl ? repository.homepageUrl : '',
    description: repository.description ? repository.description : '',
    language: repository.languages.edges[0].node.name,
  };

  Joi.assert(formatedRepository, repositoryModel.schema);

  const insertedRepo = await repositoryModel.insert(formatedRepository);
  return insertedRepo[0];
};

module.exports = {
  onRepository,
};

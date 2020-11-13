const Joi = require('joi');

const githubService = require('../../services/github');
const repositoryModel = require('../../db/models/repository');
const userModel = require('../../db/models/user');
const logger = require('../../logger');

const searchRepositoriesResponseSchema = Joi.object().keys({
  edges: Joi.array().has(Joi.object({
    node: Joi.object().keys({
      owner: Joi.object().required(),
      name: Joi.string().required(),
      description: Joi.string().allow('').required(),
      homepageUrl: Joi.string().allow('').required(),
      stargazerCount: Joi.number().required(),
      languages: Joi.object().required(),
      createdAt: Joi.string().required(),
    }).required(),
  })).required(),
  repositoryCount: Joi.number().required(),
}).required();

const onRepository = async (message) => {
  const response = await githubService.searchRepositories({ queryString: message, first: 1 });

  logger.info(response, 'Github searchRepositories() response:');

  if (!response) throw Error(`Invalid Github API response from searchRepositories: ${response}`);

  Joi.assert(response.search, searchRepositoriesResponseSchema, Error('Invalid search property on response object.'));

  const { search: { edges } } = response;
  const repository = edges[0].node;
  const { owner } = repository;

  logger.info(repository, 'Found repository:');

  const user = {
    login: owner.login,
    avatar_url: owner.avatarUrl,
    html_url: owner.url,
  };

  logger.info(user, 'Constructed user object:');

  Joi.assert(user, userModel.schema);

  let insertedUser = await userModel.read(user);

  if (!insertedUser.length) {
    insertedUser = await userModel.insert(user);
  }

  const formatedRepository = {
    owner: insertedUser[0].id,
    full_name: repository.name,
    stargazers_count: repository.stargazerCount,
    html_url: repository.homepageUrl ? repository.homepageUrl : '',
    description: repository.description ? repository.description : '',
    language: repository.languages.edges[0].node.name,
  };

  logger.info(formatedRepository, 'Constructed repository object:');

  Joi.assert(formatedRepository, repositoryModel.schema);

  const insertedRepo = await repositoryModel.insert(formatedRepository);
  const serviceResp = await githubService.getContributors(user.login, insertedRepo[0].full_name);

  const { repository: { collaborators: { edges: collaborators } } } = serviceResp;
  logger.info(collaborators, 'Collaborators:');

  return { repository: insertedRepo[0], collaborators };
};

module.exports = {
  onRepository,
};

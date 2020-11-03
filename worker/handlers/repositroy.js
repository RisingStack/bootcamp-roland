const { searchRepositories } = require('../../services/github');
const repositoryModel = require('../../db/models/repository');
const userModel = require('../../db/models/user');
const logger = require('../../logger');

const onRepository = async (message) => {
  // env = org/repo_name
  // 1 repository
  const { search: { edges } } = await searchRepositories({ queryString: message, first: 1 });

  const repository = edges[0].node;
  const { owner } = repository;

  logger.info(JSON.stringify(owner));

  const user = {
    login: owner.login,
    avatar_url: owner.avatarUrl,
    html_url: owner.url,
  };

  logger.info(JSON.stringify(user));

  const userResult = userModel.schema.validate(user);
  if (userResult.error) {
    logger.error(userResult.error);
    process.exit(1);
  }

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
    language: repository.languages.edges[0].name,
  };

  const repositoryResult = repositoryModel.schema.validate(formatedRepository);
  if (repositoryResult.error) {
    logger.error(repositoryResult.error);
    process.exit(1);
  }

  logger.info(repositoryResult);

  const insertedRepos = await repositoryModel.insert(repositoryResult.value);
  return (insertedRepos);
};

module.exports = {
  onRepository,
};

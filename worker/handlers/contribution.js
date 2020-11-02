const logger = require('../../logger');
const userModel = require('../../db/models/user');
const contributionModel = require('../../db/models/contribution');
const { getContributors } = require('../../services/github');

async function onContribution(message) {
  const repositories = JSON.parse(message);
  logger.info(JSON.stringify(repositories));

  repositories.forEach(async repository => {
    const repositoryName = repository.full_name;

    logger.info(`repositoryName: ${repositoryName}`);

    const dbResponse = await userModel.read({ id: repository.owner });
    const owner = dbResponse[0];

    logger.info(`userLogin: ${owner.login}`);

    const githubResponse = await getContributors(owner.login, repositoryName);
    const collaborators = githubResponse.repository.collaborators.edges;

    logger.info(JSON.stringify(collaborators));

    collaborators.map(async (collaborator) => {
      const user = {
        login: collaborator.node.login,
        avatar_url: collaborator.node.avatarUrl,
        html_url: collaborator.node.url,
      };

      let response = await userModel.read(user);
      if (!response.length) {
        response = await userModel.insert(user);
      }

      const contribution = {
        user: response[0].id,
        repository: repository.id,
        lineCount: 0,
      };

      contributionModel.insertOrReplace(contribution);
    });
  });
}

module.exports = {
  onContribution,
};

const logger = require('../../logger');
const userModel = require('../../db/models/user');
const { getContributors } = require('../../services/github');

async function onContribution(message) {
  const repositories = JSON.parse(message);

  repositories.forEach(async repository => {
    const repositoryName = repository.full_name;
    logger.info(`repositoryName: ${repositoryName}`);
    const dbResponse = await userModel.read({ id: repository.owner });
    const owner = dbResponse[0];
    logger.info(`userLogin: ${owner.login}`);

    const githubResponse = await getContributors(owner.login, repositoryName);
    const collaborators = githubResponse.repository.collaborators.edges;

    logger.info(JSON.stringify(collaborators));

    const usersToInsert = collaborators.map(async (collaborator) => {
      const user = {
        login: collaborator.node.login,
        avatar_url: collaborator.node.avatarUrl,
        html_url: collaborator.node.url,
      };

      const existingUser = await userModel.read(user);
      if (!existingUser.length) {
        return user;
      }
    });

    Promise.all(usersToInsert).then((resolvedUsers) => userModel.insert(resolvedUsers));
  });
}

module.exports = {
  onContribution,
};

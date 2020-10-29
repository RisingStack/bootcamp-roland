const { searchRepositories } = require('../../services/github');
const repositoryModel = require('../../db/models/repository');
const userModel = require('../../db/models/user');

async function onRepository(message) {
  const { search } = await searchRepositories({ queryString: message });

  const repositories = search.edges.map(async ({ node }) => {
    const user = {
      login: node.owner.login,
      avatar_url: node.owner.avatarUrl,
      html_url: node.owner.url,
    };

    const userResult = userModel.schema.validate(user);
    if (userResult.error) throw Error(userResult.error);

    let userToInsert = await userModel.read(user);

    if (!userToInsert.length) {
      userToInsert = await userModel.insert(user);
    }

    const repository = {
      owner: userToInsert[0].id,
      full_name: node.name,
      stargazers_count: node.stargazerCount,
      html_url: node.homepageUrl,
      description: node.description,
      language: node.languages.edges[0].node.name,
    };

    const repositoryResult = repositoryModel.schema.validate(repository);
    if (repositoryResult.error) throw Error(repositoryResult.error);

    return repository;
  });

  Promise.all(repositories)
    .then(repos => {
      repositoryModel.insert(repos);
      return repos;
    }).catch(error => { throw Error(error); });
}

module.exports = {
  onRepository,
};

const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const { onRepository } = require('./repository');
const githubService = require('../../services/github');
const repositoryModel = require('../../db/models/repository');

chai.use(chaiAsPromised);
const { expect } = chai;
chai.should();

const mockMessage = {
  search: {
    edges: [{
      node: {
        owner: { login: 'testUser', avatarUrl: 'https://www.test.com', url: 'https://www.test.com' },
        name: 'testName',
        description: 'Test descreption',
        homepageUrl: 'test.com',
        stargazerCount: 10,
        languages: {
          edges: [{
            node: {
              name: 'Test language',
            },
          }],
        },
        createdAt: '2010',
      },
    }],
  },
};

describe('Repository worker handler', () => {
  let searchRepositories;

  beforeEach(function () {
    searchRepositories = sinon.stub(githubService, 'searchRepositories');
  });

  afterEach(function () {
    searchRepositories.restore();
  });

  it('Should run without errors', async () => {
    searchRepositories.resolves(mockMessage);

    const repository = await onRepository('Test run');

    const response = await repositoryModel.read({ full_name: 'testName' });

    const mockRepository = {
      description: 'Test descreption',
      full_name: 'testName',
      html_url: 'test.com',
      id: response[0].id,
      language: 'Test language',
      owner: response[0].owner,
      stargazers_count: 10,
    };

    expect(repository).to.deep.equal(mockRepository);
  });

  it('Should be rejected with error', async () => {
    const invalidResponse = null;
    searchRepositories.resolves(invalidResponse);

    onRepository('').should.be.rejectedWith(`Invalid Github API response from searchRepositories: ${invalidResponse}`);
  });
});

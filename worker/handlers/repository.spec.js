const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const { onRepository } = require('./repository');
const githubService = require('../../services/github');

const mockMessage = {
  search: {
    edges: [{
      node: {
        owner: 'test',
        name: 'testName',
        description: 'Test descreption',
        homepageUrl: 'test.com',
        stargazerCount: 10,
        languages: 'JS',
        createdAt: '2010',
      },
    }],
  },
};

describe('Repository worker handler', () => {
  it('Should run without errors', async () => {
    sinon.stub(githubService, 'searchRepositories').resolves(mockMessage);

    await onRepository('Test run');
  });
});

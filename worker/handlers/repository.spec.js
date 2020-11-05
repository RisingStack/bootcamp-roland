const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const { onRepository } = require('./repositroy');
const { searchRepositories } = require('../../services/github');

const mockMessage = [{
  node: {
    owner: '',
    name: '',
    description: '',
    homepageUrl: '',
    stargazerCount: '',
    languages: '',
    createdAt: '',
  }
}];

describe('Repository worker handler', () => {
  it('Should run without errors', () => {
    const searchRepositoriesStub = sinon.stub(searchRepositories).resolves('resolved');

    onRepository()
  });
})
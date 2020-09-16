const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const config = require('../config');
const server = require('../index');
const github = require('../services/github');

const should = chai.should();

chai.use(chaiHttp);

const searchRepositoryQueryString = `query search($queryString:String!){ 
    search(query: $queryString, type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
        ... on RepositoryInfo {
          name
          createdAt
          owner {
            id
            login
          }
        }
      }
    }}
  }`;

const getContributorsQueryString = `query collaboratorsQuery($owner:String!,$repoName:String!){
    repository(owner: $owner, name: $repoName) {
      collaborators(first:100, affiliation: DIRECT) {
        edges {
          node {
            id
            login
            url
            avatarUrl
          }
        }
      }
    }
  }`;

describe('Github service', () => {
  const githubAPIMock = nock('https://api.github.com');

  it('should use Authorization header and a token provided from config.js', async () => {
    const scope = githubAPIMock.matchHeader('Authorization', `Bearer ${config.githubToken}`).post('/graphql').reply(200, { data: {} });
    await github.searchRepositories('WordsMemorizer');
    scope.done();
  });

  describe('Invoking getContributors', () => {
    const mockResponse = {
      repository: {
        collaborators: {
          edges: [{
            node: {
              id: 'TEST_ID',
              login: 'testLogin',
              url: 'https://testurl.test',
              avatarUrls: 'valami url az avatarhoz'
            }
          }]
        }
      }
    };

    it('should return dummy response', async () => {
      const scope = githubAPIMock.post('/graphql').reply(200, { data: mockResponse });
      const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
      response.should.deep.equal(mockResponse);
    });

    it('should include "$owner" and "$repoName" query variable', async () => {
      const scope = githubAPIMock.post('/graphql', (body) => (body.query && body.query === getContributorsQueryString)).reply(200, { data: mockResponse });
      await github.getContributors('WordsMemorizer');
      scope.done();
    });
  });


  describe('Invoking searchRepositories', () => {
    const mockResponse = {
      createdAt: '2020',
      collaborators: {
        totalCount: 1,
        edges: [{ node: { login: 'bela' } }]
      }
    };

    it('should return dummy response', async () => {
      githubAPIMock.post('/graphql').reply(200, { data: mockResponse });
      const response = await github.searchRepositories('WordsMemorizer');
      response.should.deep.equal(mockResponse);
    });

    // TODO: refact
    it.skip('should include "$queryString" query variable', async () => {
      const scope = githubAPIMock.post('/graphql', body => (body.query && body.query === searchRepositoryQueryString)).reply(200, { data: mockResponse });
      await github.searchRepositories('WordsMemorizer');
      scope.done();
    });
  });
});

describe('Web instance', () => {
  describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
      const response = await chai.request(server).get('/hello');
      response.should.have.status(200);
      response.text.should.equal('Hello World !');
    });
  });
});


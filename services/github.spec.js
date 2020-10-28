const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');
const chaiAsPromised = require('chai-as-promised');

const config = require('../config');
const github = require('./github');

chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

const searchRepositoryQueryString = `query search($queryString:String!, $first:Int){ 
    search(query: $queryString, type: REPOSITORY, first: $first) {
      repositoryCount
      edges {
        node {
        ... on Repository {
          name
          description
          homepageUrl
          stargazerCount
          languages(first: 1) {
            edges {
              node {
                name
              }
            }
          }
          createdAt
          owner {
            id
            login
            avatarUrl
            url
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

const githubAPIMock = nock('https://api.github.com');

describe('Github service', () => {
  it('should use Authorization header and a token provided from config.js', async () => {
    const scope = githubAPIMock.matchHeader('Authorization', `Bearer ${config.githubToken}`).post('/graphql').reply(200, { data: {} });
    await github.searchRepositories({ queryString: 'WordsMemorizer' });
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
              avatarUrls: 'valami url az avatarhoz',
            },
          }],
        },
      },
    };

    it('should return dummy response', async () => {
      const scope = githubAPIMock.post('/graphql').reply(200, { data: mockResponse });
      const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
      response.should.deep.equal(mockResponse);
      scope.done();
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
        edges: [{ node: { login: 'bela' } }],
      },
    };

    it('should throw "queryString is a mandatory parameter"', () => (github.searchRepositories().should.be.rejectedWith('queryString is a mandatory parameter')));

    it('should return dummy response', async () => {
      githubAPIMock.post('/graphql').reply(200, { data: mockResponse });
      const response = await github.searchRepositories({ queryString: 'WordsMemorizer' });
      response.should.deep.equal(mockResponse);
    });

    it('should include "$queryString" query variable', async () => {
      const scope = githubAPIMock.post('/graphql', body => (body.query && body.query === searchRepositoryQueryString)).reply(200, { data: mockResponse });
      await github.searchRepositories({ queryString: 'WordsMemorizer' });
      scope.done();
    });
  });
});

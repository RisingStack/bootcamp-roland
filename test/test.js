const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const server = require('../index');
const github = require('../services/github');

const should = chai.should();
const githubAPIMock = nock('https://api.github.com');

chai.use(chaiHttp);

describe('Github service', () => {
    it.skip('should use provided auth header/ check used token', async () => {});
});

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
        const response = await chai.request(server).get('/hello');
        response.should.have.status(200);
        response.text.should.equal('Hello World !');
    });
});

describe('Invoking searchRepositories', () => {
    it('should return dummy response', async () => {

        const mockResponse = {
            createdAt: '2020',
            collaborators: {
                totalCount: 1,
                edges: [{ node: { login: 'bela'}}]
            }
        };

        githubAPIMock.post('/graphql').reply(200,{data: mockResponse});

        const response = await github.searchRepositories('WordsMemorizer');
        response.should.deep.equal(mockResponse);
    });
    it.skip('test queryString input', async () => {});
});

describe('Invoking getContributors', () => {
    it('should return dummy response', async () => {
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

        githubAPIMock.post('/graphql').reply(200,{data: mockResponse});
        const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
        response.should.deep.equal(mockResponse);
    });
});
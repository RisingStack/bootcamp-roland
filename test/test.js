const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const server = require('../index');
const github = require('../services/github');

const should = chai.should();
const githubAPIMock = nock('https://api.github.com');

chai.use(chaiHttp);

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
        const response = await chai.request(server).get('/hello');
        response.should.have.status(200);
        response.text.should.equal('Hello World !');
    });
});

describe('Invoking searchRepositories', () => {
    it('should return dummy response', async () => {
        githubAPIMock.post('/graphql').reply(200,{
            data: {
                createdAt: '2020',
                collaborators: {
                    totalCount: 1,
                    edges: [{
                        node: {
                            login: 'bela'
                        }
                    }
                    ]
                }
            }
        });
        // Is "await" needed here ?
        await github.searchRepositories('WordsMemorizer');
    });
});

describe('Invoking getContributors', () => {
    it('should return dummy response', async () => {
        githubAPIMock.post('/graphql').reply(200,{
            data: {
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
            }
        });
        // Is "await" needed here ?
        await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
    });
});
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');
const github = require('../services/github');

const should = chai.should();

chai.use(chaiHttp);

const nock = require('nock');

const scope = nock('https://api.github.com');

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
        const response = await chai.request(server).get('/hello');
        response.should.have.status(200);
        response.text.should.equal('Hello World !');
    });
});

describe('Invoking searchRepositories', () => {
    it('should return something', async () => {
        scope.post('/graphql').reply(200,{
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
        const response = await github.searchRepositories('WordsMemorizer');
        console.log(JSON.stringify(response, undefined, '-'));
    });
});

describe('Invoking getContributors', () => {
    it('should return something', async () => {
        scope.post('/graphql').reply(200,{
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
        const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
        console.log(JSON.stringify(response, undefined, '-'));
    });
});
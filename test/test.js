const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const config = require('../config');
const server = require('../index');
const github = require('../services/github');

const should = chai.should();
const githubAPIMock = nock('https://api.github.com');

chai.use(chaiHttp);

describe('Github service', () => {
    it('should use Authorization header and a token provided from config.js', async () => {
        githubAPIMock.matchHeader('Authorization', `Bearer ${config.githubToken}`).post('/graphql');
        await github.searchRepositories('WordsMemorizer');

        if (!githubAPIMock.isDone()) {
            //githubAPIMock.cleanAll();
            throw 'GitHub API must have been called with the Bearer token';
        }
    });
});

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
        const response = await chai.request(server).get('/hello');
        response.should.have.status(200);
        response.text.should.equal('Hello World !');
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

    it('should include "$queryString" query variable', async () => {
        githubAPIMock.post('/graphql').reply(200, function (uri, requestBody) {
            requestBody.query.should.to.match(/\$queryString:String!/g, '"queryString" is missing!');
            requestBody.query.should.to.match(/query:\s*\$queryString/g, '"queryString" is missing!');
            return { data: mockResponse };
        });
        await github.searchRepositories('WordsMemorizer');
    });
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
        githubAPIMock.post('/graphql').reply(200, { data: mockResponse });
        const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
        response.should.deep.equal(mockResponse);
    });

    it('should include "$owner" and "$repoName" query variable', async () => {
        githubAPIMock.post('/graphql').reply(200, function (uri, requestBody) {
            requestBody.query.should.to.match(/\$owner:String!,\s*\$repoName:String!/g, '"$owner" or "$repoName" is missing!');
            requestBody.query.should.to.match(/owner:\s*\$owner,\s*name:\s*\$repoName/g, '"$owner" or "$repoName" is missing!');
            return { data: mockResponse };
        });
        await github.getContributors('WordsMemorizer');
    });
});
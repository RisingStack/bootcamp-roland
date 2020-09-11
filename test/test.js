const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index');
const github = require('../services/github');

const should = chai.should();

chai.use(chaiHttp);

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
        const response = await chai.request(server).get('/hello');
        response.should.have.status(200);
        response.text.should.equal('Hello World !');
    });
});

describe('Invoking searchRepositories', () => {
    it('should return something', async () => {
        const response = await github.searchRepositories('WordsMemorizer');
        console.log(JSON.stringify(response, undefined, '-'));
    });
});

describe('Invoking getContributors', () => {
    it('should return something', async () => {
        const response = await github.getContributors('RisingStack', 'risingstack-bootcamp-v2');
        console.log(JSON.stringify(response, undefined, '-'));
    });
});
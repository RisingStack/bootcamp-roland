const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const server = require('./index');
const knex = require('./db/db');
const user = require('./db/models/user');
const repository = require('./db/models/repository');
const contribution = require('./db/models/contribution');

const should = chai.should();

chai.use(chaiHttp);

describe('Web instance', () => {
  describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
      const response = await chai.request(server).get('/hello');
      response.should.have.status(200);
      response.text.should.equal('Hello World !');
    });
  });

  describe('GET /repository', async () => {
    beforeEach(async () => {
      await knex.raw('TRUNCATE TABLE repository CASCADE');
      await knex.raw('ALTER SEQUENCE repository_id_seq RESTART WITH 1');
    });

    describe('/:id', () => {
      it('returns a repository with given ID', async () => {
        const dummyRepo = {
          id: 1,
          owner: 1,
          full_name: 'Bela Todo list',
          description: 'Bela Todo list',
          html_url: 'https://github.com/',
          language: 'eng',
          stargazers_count: 5
        };
        await repository.insert(dummyRepo);
        const response = await chai.request(server).get(`/repository/${dummyRepo.id}`);
        response.should.have.status(200);
        response.body[0].should.deep.equal(dummyRepo);
      });
    });

    describe('/:id with invalid path variable', () => {
      it('returns 403', async () => {
        const dummyRepo = {
          id: 1,
          owner: 1,
          full_name: 'Bela Todo list',
          description: 'Bela Todo list',
          html_url: 'https://github.com/',
          language: 'eng',
          stargazers_count: 5
        };
        await repository.insert(dummyRepo);
        const response = await chai.request(server).get('/repository/asd');
        response.should.have.status(403);
      });
    });

    describe('?id=', () => {
      it('returns a repository with given ID', async () => {
        const dummyRepo = {
          id: 1,
          owner: 1,
          full_name: 'Bela Todo list',
          description: 'Bela Todo list',
          html_url: 'https://github.com/',
          language: 'eng',
          stargazers_count: 5
        };
        await repository.insert(dummyRepo);
        const response = await chai.request(server).get(`/repository?id=${dummyRepo.id}`);
        response.should.have.status(200);
        response.body[0].should.deep.equal(dummyRepo);
      });
    });
    describe('?id= with invalid query variable', () => {
      it('returns 403', async () => {
        const response = await chai.request(server).get('/repository?id=asd');
        response.should.have.status(403);
      });
    });

    describe('POST /repository', () => {
      it('returns the inserted object', async () => {
        const dummyRepo = {
          owner: 1,
          full_name: 'Bela Todo list',
          description: 'Bela Todo list',
          html_url: 'https://github.com/',
          language: 'eng',
          stargazers_count: 5
        };
        await chai.request(server)
          .post('/repository')
          .type('application/json')
          .send(dummyRepo);
        dummyRepo.id = 1;
        const repo = await repository.read(dummyRepo);
        repo[0].should.deep.equal(dummyRepo);
      });
      it('returns 403', async () => {
        const dummyRepo = {};
        const response = await chai.request(server)
          .post('/repository')
          .type('application/json')
          .send(dummyRepo);
        response.should.have.status(403);
      });
    });
  });
});

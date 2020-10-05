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

const mockRepo = {
  id: 1,
  owner: 1,
  full_name: 'Bela Todo list',
  description: 'Bela Todo list',
  html_url: 'https://github.com/',
  language: 'eng',
  stargazers_count: 5
};

const mockUser = {
  id: 1,
  login: 'bela',
  avatar_url: 'https://github.com/avatar',
  html_url: 'https://github.com/avatar'
};

const mockContribution = {
  user: 1,
  repository: 1,
  line_count: 50
};

describe('Web instance', () => {
  beforeEach(async () => {
    await knex.raw('TRUNCATE TABLE contribution CASCADE');
    await knex.raw('TRUNCATE TABLE repository CASCADE');
    await knex.raw('TRUNCATE TABLE "user" CASCADE');
    await knex.raw('ALTER SEQUENCE repository_id_seq RESTART WITH 1');
  });

  describe('GET /hello', () => {
    it('returns \'Hello World ! \'', async () => {
      const response = await chai.request(server).get('/hello');
      response.should.have.status(200);
      response.text.should.equal('Hello World !');
    });
  });

  describe('GET /repository', async () => {

    describe('/:id', () => {
      it('returns a repository with given ID', async () => {
        await repository.insert(mockRepo);
        const response = await chai.request(server).get(`/repository/${mockRepo.id}`);
        response.should.have.status(200);
        response.body[0].should.deep.equal(mockRepo);
      });
    });

    describe('/:id with invalid path variable', () => {
      it('returns 403', async () => {
        await repository.insert(mockRepo);
        const response = await chai.request(server).get('/repository/asd');
        response.should.have.status(403);
      });
    });

    describe('?id=', () => {
      it('returns a repository with given ID', async () => {
        await repository.insert(mockRepo);
        const response = await chai.request(server).get(`/repository?id=${mockRepo.id}`);
        response.should.have.status(200);
        response.body[0].should.deep.equal(mockRepo);
      });
    });
    describe('?id= with invalid query variable', () => {
      it('returns 403', async () => {
        const response = await chai.request(server).get('/repository?id=asd');
        response.should.have.status(403);
      });
    });
  });
  
  describe('POST /repository', () => {
    it('returns the inserted object', async () => {
      const { id, owner, full_name, description, html_url, language, stargazers_count } = mockRepo;
      await chai.request(server)
        .post('/repository')
        .type('application/json')
        .send({ owner, full_name, description, html_url, language, stargazers_count });
      const repo = await repository.read({ id });
      repo[0].should.deep.equal(mockRepo);
    });
    it('returns 403', async () => {
      const response = await chai.request(server)
        .post('/repository')
        .type('application/json')
        .send(mockRepo);
      response.should.have.status(403);
    });
  });

  describe('GET /contribution', () => {
    it('returns all users contributed to a single repository', async () => {
      await user.insert(mockUser);
      await repository.insert(mockRepo);
      await contribution.insert(mockContribution);

      const response = await chai.request(server).get(`/contribution?userID=${mockUser.id}`);
      const { user: userResp, repository: repositoryResp } = response.body[0];

      userResp.should.deep.equal({ id: mockUser.id, login: mockUser.login });
      repositoryResp.should.deep.equal({ id: mockRepo.id, full_name: mockRepo.full_name });
    });
  });

  describe('POST /contribution', () => {
    it('returns inserted contribution', async () => {
      await user.insert(mockUser);
      await repository.insert(mockRepo);

      await chai.request(server)
        .post('/contribution')
        .type('application/json')
        .send(mockContribution);

      const response = await contribution.read({ id: mockUser.id });
      const { user: userResp, repository: repositoryResp } = response[0];

      userResp.should.deep.equal({ id: mockUser.id, login: mockUser.login });
      repositoryResp.should.deep.equal({ id: mockRepo.id, full_name: mockRepo.full_name });

    });
  });
});

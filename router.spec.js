const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

process.env.NODE_ENV = 'test';

const server = require('./index');
const db = require('./db/db');
const contribution = require('./db/models/contribution');
const config = require('./config');

const apiRoute = '/api';
const apiRouteV1 = `${apiRoute}/v1`;

chai.use(chaiHttp);

const mockRepo = {
  owner: 1,
  full_name: 'Bela Todo list',
  description: 'Bela Todo list',
  html_url: 'https://github.com/',
  language: 'eng',
  stargazers_count: 5,
};

const mockUser = {
  login: 'bela',
  avatar_url: 'https://github.com/avatar',
  html_url: 'https://github.com/avatar',
};

const mockContribution = {
  user: 1,
  repository: 1,
  lineCount: 50,
};

const token = jwt.sign({}, config.jwt);

describe('Web instance', () => {
  describe('GET /hello', () => {
    it("returns 'Hello World ! ", async () => {
      const response = await chai.request(server).get(`${apiRouteV1}/hello`);
      response.should.have.status(200);
      response.text.should.equal('Hello World !');
    });
  });

  describe('GET /repository', () => {
    describe('/:id', () => {
      it('returns a repository with given ID', async () => {
        const id = await db('repository').insert(mockRepo).returning('id');
        const response = await chai.request(server).get(`${apiRouteV1}/repository/${id}`);
        response.should.have.status(200);
        response.body[0].should.include(mockRepo);
      });
    });

    describe('/:id with invalid path variable', () => {
      it('returns 403', async () => {
        const response = await chai.request(server).get(`${apiRouteV1}/repository/asd`);
        response.should.have.status(403);
      });
    });

    describe('?id=', () => {
      it('returns a repository with given ID', async () => {
        const id = await db('repository').insert(mockRepo).returning('id');
        const response = await chai.request(server).get(`${apiRouteV1}/repository?id=${id}`);
        response.should.have.status(200);
        response.body[0].should.include(mockRepo);
      });
    });

    describe('?id= with invalid query variable', () => {
      it('returns 403', async () => {
        const response = await chai.request(server).get(`${apiRouteV1}/repository?id=asd`);
        response.should.have.status(403);
      });
    });
  });

  describe('POST /repository', () => {
    it('returns the inserted object', async () => {
      const response = await chai.request(server)
        .post(`${apiRouteV1}/repository`)
        .type('application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(mockRepo);
      const repo = await db('repository').select('*').where({});
      response.should.have.status(200);
      repo[0].should.include(mockRepo);
    });
    it('returns 403', async () => {
      const response = await chai.request(server)
        .post(`${apiRouteV1}/repository`)
        .set('Authorization', `Bearer ${token}`)
        .type('application/json')
        .send({});
      response.should.have.status(403);
    });
  });

  describe('/contribution', () => {
    before('before hook', async () => {
      await db('user').insert(mockUser);
      await db('repository').insert(mockRepo);
      await db('contribution').insert({
        line_count: mockContribution.lineCount,
        user: mockContribution.user,
        repository: mockContribution.repository,
      });
    });

    describe('GET /contribution', () => {
      it('returns all users contributed to a single repository', async () => {
        const response = await chai.request(server).get(`${apiRouteV1}/contribution?login=${mockUser.login}`);
        const { user: userResp, repository: repositoryResp } = response.body[0];

        userResp.should.include({ login: mockUser.login });
        repositoryResp.should.include({ fullName: mockRepo.full_name });
      });
    });

    describe('POST /contribution', () => {
      it('returns inserted contribution', async () => {
        await db('contribution').delete(mockContribution);

        const postResponse = await chai.request(server)
          .post(`${apiRouteV1}/contribution`)
          .set('Authorization', `Bearer ${token}`)
          .type('application/json')
          .send(mockContribution);

        const { id } = await db('user').where({ login: mockUser.login }).select('id').first();
        const readResponse = await contribution.read({ user: { id } });
        const { user: userResp, repository: repositoryResp } = readResponse[0];

        postResponse.should.have.status(200);
        userResp.should.include({ login: mockUser.login });
        repositoryResp.should.include({ fullName: mockRepo.full_name });
      });
      it('returns 401', async () => {
        await db('contribution').delete(mockContribution);

        const response = await chai.request(server)
          .post(`${apiRouteV1}/contribution`)
          .type('application/json')
          .send(mockContribution);

        response.should.have.status(401);
      });
    });
  });
});

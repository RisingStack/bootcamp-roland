const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('./index');

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
  }); 
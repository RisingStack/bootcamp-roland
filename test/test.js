const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('GET /hello', () => {
    it('returns \'Hello World ! \'', () => {
        chai.request(server)
            .get('/hello')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.equal('Hello World !');
            done();
          });
    });
});
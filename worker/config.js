const config = require('../config');

const clientConfig = {
  port: config.redisPort,
  host: '172.17.0.1',
};

module.exports = clientConfig;

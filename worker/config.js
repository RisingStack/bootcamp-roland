const config = require('../config');

const clientConfig = {
  port: config.redis.port,
  host: config.redis.host,
};

module.exports = clientConfig;

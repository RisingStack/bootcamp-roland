const config = require('./config');

const logger = require('pino')({ // eslint-disable-line import/order
  prettyPrint: true,
  level: config.logger.level,
  redact: {
    paths: ['req.headers.cookie', 'req.headers.authorization', 'res.headers.cookie', 'res.headers.authorization'],
    remove: true,
  },
});

module.exports = logger;

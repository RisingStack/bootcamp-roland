const jwt = require('jsonwebtoken');
const logger = require('./logger');

const config = require('./config');

function authMiddleware(req, res, next) {
  try {
    if (!req.headers.authorization) throw Error('Authentication failed');
    const token = req.headers.authorization.replace(/Bearer\s*/, '');
    jwt.verify(token, config.jwt);

    logger.debug('[authenticator.js]', token);

    return next();
  } catch (error) {
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = authMiddleware;

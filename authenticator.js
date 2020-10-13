const jwt = require('jsonwebtoken');
const logger = require('./logger');

const config = require('./config');

function authMiddleware(req, res, next) {
    try {
        if (!req.headers.authorization) throw 'Authentication failed!';
        const token = req.headers.authorization.replace(/Bearer\s*/, '');
        const decoded = jwt.verify(token, config.jwt);
        req.body.username = decoded.username;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
}

module.exports = authMiddleware;

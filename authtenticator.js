const jwt = require('jsonwebtoken');
const logger = require('./logger');

const config = require('./config');

function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization.replace(/Bearer\s*/, '');
        const decoded = jwt.verify(token, config.jwt);
        req.body.username = decoded.username;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authMiddleware;

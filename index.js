const express = require('express');

const logger = require('./logger');
const httpLogger = require('express-pino-logger')({ logger });
const config = require('./config');
const router = require('./router');

const app = express();

app.use(express.json());
app.use(httpLogger);
app.use('/api/v1/', router);
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    logger.error(error.toString);
    return res.status(statusCode).json({ error: error.toString() });
});

app.listen(config.port, () => logger.info(`App is listening on port: ${config.port}`));

module.exports = app;

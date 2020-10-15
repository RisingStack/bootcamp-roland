const express = require('express');
const httpLogger = require('express-pino-logger');

const logger = require('./logger');
const config = require('./config');
const router = require('./router');
const routerAuth = require('./router-auth');

const app = express();

httpLogger({ logger });

app.use(express.json());
app.use(httpLogger);
app.use('/api/', routerAuth);
app.use('/api/v1/', router);
app.use((error, req, res) => {
    const statusCode = error.statusCode || 500;
    logger.error(error.toString());
    return res.status(statusCode).json({ error: error.toString() });
});

app.listen(config.port, () => logger.info(`App is listening on port: ${config.port}`));

module.exports = app;

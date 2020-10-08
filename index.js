const express = require('express');

const logger = require('./logger');
const config = require('./config');
const router = require('./router');

const app = express();

app.use(express.json());
//app.use(console.log);
app.use(logger);
app.use('/api/v1/', router);
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ error: error.toString() });
});

app.listen(config.port, () => console.log(`App is running on ${config.port}`));

module.exports = app;

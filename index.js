const express = require('express');

const config = require('./config');
const router = require('./router');

const app = express();

app.use(express.json());
app.use('/', router);
app.use((error, req, res, next) => {
    return res.status(500).json({ error: error.toString() });
});

app.listen(config.port, () => console.log(`App is running on ${config.port}`));

module.exports = app;

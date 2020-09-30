const express = require('express');

const config = require('./config');
const router = require('./router');

const app = express();

app.use(express.json());
app.use('/', router);

app.listen(config.port, () => console.log(`App is running on ${config.port}`));
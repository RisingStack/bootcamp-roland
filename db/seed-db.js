const knex = require('./db');
const logger = require('../logger');

knex.seed.run().then(() => {
    logger.info('Database seeding is a success!');
    process.exit(0);
}).catch((error) => {
    logger.error(error);
    process.exit(1);
});

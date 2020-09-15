const knex = require('./db');

knex.migrate.latest().then(() => {
    console.log('DB migration is a success !');
    process.exit(0);
}).catch((err) => {
    throw 'DB migration failed!';
});


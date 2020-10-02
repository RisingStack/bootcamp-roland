const knex = require('./db');

knex.migrate.down().then(() => {
    knex.migrate.latest().then(() => {
        console.log('DB migration is a success !');
        process.exit(0);
    }).catch((error) => {
        throw 'DB migration failed!';
    });
});

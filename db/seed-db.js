const knex = require('./db');

knex.seed.run().then(() => {
    console.log('Database seeding is a success!');
    process.exit(0);
}).catch((error) => {
    console.log(error);
    process.exit(1);
});

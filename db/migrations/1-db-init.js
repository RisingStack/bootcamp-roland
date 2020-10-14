const logger = require('../../logger');

const userTable = 'user';
const repoTable = 'repository';
const contributionTable = 'contribution';
const appUserTable = 'app_user';

async function up(knex) {
  try {
    await knex.schema.createTable(userTable, (table) => {
      table.increments('id').primary();
      table.string('login', 255).notNullable();
      table.string('avatar_url', 255);
      table.string('html_url', 255);
    });
    await knex.schema.createTable(repoTable, (table) => {
      table.increments('id').primary();
      table.integer('owner').notNullable();
      table.string('full_name', 255).notNullable();
      table.string('description', 255);
      table.string('html_url', 255);
      table.string('language', 255);
      table.integer('stargazers_count');
    });
    await knex.schema.createTable(contributionTable, (table) => {
      table.integer('user').references('id').inTable('user').notNullable();
      table.integer('repository').references('id').inTable('repository').notNullable();
      table.integer('line_count');
      table.unique(['user', 'repository']);
    });
    await knex.schema.createTable(appUserTable, (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('password').notNullable();
    });
    logger.info('Migration was successful!');
  } catch (error) {
    logger.error(error, 'Failed to migarte DB');
  }
}
async function down(knex) {
  await knex.schema.dropTableIfExists(contributionTable);
  await knex.schema.dropTableIfExists(repoTable);
  await knex.schema.dropTableIfExists(userTable);
  await knex.schema.dropTableIfExists(appUserTable);
}

module.exports = {
  up,
  down
};

const tableName = 'user';

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.string('login', 255).notNullable();
    table.string('avatar_url', 255);
    table.string('html_url', 255);
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down
};

const tableName = 'repository';

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').primary();
    table.integer('owner').notNullable();
    table.string('full_name', 255).notNullable();
    table.string('description', 255);
    table.string('html_url', 255);
    table.string('language', 255);
    table.integer('stargazers_count');
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down
};

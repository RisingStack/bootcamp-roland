const tableName = 'contributon';

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('user').references('id').inTable('user').notNullable();
    table.integer('repository').references('id').inTable('repository').notNullable();
    table.integer('line_count');
  });
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName);
}

module.exports = {
  up,
  down
};
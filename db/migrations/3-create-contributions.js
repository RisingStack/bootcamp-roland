const tableName = 'contribution';

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('user').references('id').inTable('user').unique().notNullable();
    table.integer('repository').references('id').inTable('repository').unique().notNullable();
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

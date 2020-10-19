function seed(knex) {
  return knex('contribution').insert([
    { user: 1, repository: 1, line_count: 150 },
    { user: 1, repository: 4, line_count: 21 },
    { user: 1, repository: 5, line_count: 48 },
    { user: 2, repository: 3, line_count: 35 },
    { user: 3, repository: 4, line_count: 78 },
    { user: 3, repository: 2, line_count: 103 },
    { user: 4, repository: 5, line_count: 98 },
  ]);
}

module.exports = { seed };

function seed(knex) {
  return knex('user').insert([
    {
      id: 1, login: 'janos', avatar_url: 'https://github.com/avatar/janos', html_url: 'https://github.com/avatar/janos',
    },
    {
      id: 2, login: 'bela', avatar_url: 'https://github.com/avatar/bela', html_url: 'https://github.com/avatar/bela',
    },
    {
      id: 3, login: 'geza', avatar_url: 'https://github.com/avatar/geza', html_url: 'https://github.com/avatar/geza',
    },
    {
      id: 4, login: 'aron', avatar_url: 'https://github.com/avatar/aron', html_url: 'https://github.com/avatar/aron',
    },
  ]);
}

module.exports = { seed };

seed = function (knex) {
    return knex('repository').insert([
        { id: 1, owner: 1, full_name: 'Janos Todo list', description: 'Janos Todo list', html_url: 'https://github.com/', language: 'eng', stargazers_count: 5 },
        { id: 2, owner: 1, full_name: 'Janos checklist', description: 'Janos checklist', html_url: 'https://github.com/', language: 'hu', stargazers_count: 11 },
        { id: 3, owner: 2, full_name: 'Bela shopping list', description: 'Bela shopping list', html_url: 'https://github.com/', language: 'eng', stargazers_count: 14 },
        { id: 4, owner: 3, full_name: 'Geza calendar', description: 'Geza calendar', html_url: 'https://github.com/', language: 'ger', stargazers_count: 7 },
        { id: 5, owner: 4, full_name: 'Aron shoping list', description: 'Aron shoping list', html_url: 'https://github.com/', language: 'hu', stargazers_count: 9 },
    ]);
};

module.exports = { seed };

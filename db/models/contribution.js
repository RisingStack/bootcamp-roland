const Joi = require('joi');
const db = require('../db');

const Contribution = Joi.object({
    user: Joi.number().required(),
    repository: Joi.number().required(),
    line_count: Joi.number().required(),
});

async function insert(data) {
    console.log(data);

    try {
        Joi.assert(data, Repository);
        const response = await db('contribution').insert(data);
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
}

async function insertOrReplace({ repository, user, line_count }) {
    Joi.assert({ repository, user, line_count }, Contribution);
    const response = await db.raw(`
        INSERT INTO contribution ("user",repository,line_count) 
        VALUES (${user}, ${repository}, ${line_count})
        ON CONFLICT ("user", repository) DO UPDATE SET "user"=EXCLUDED."user", repository=EXCLUDED.repository, line_count=EXCLUDED.line_count
    `);
    return response;
}

async function read({ user = {id: '', login: ''}, repository = {id: '', full_name: ''}}) {
    let condition = '';
    let columns = '';
    console.log(user);
    console.log(repository);

    console.log(user !== {id: '', login: ''});
    console.log(repository == {id: '', full_name: ''});

    // If only user provided -> list contributions created by the given user
    // WHERE "user".id = userID OR "user".login = login
    // Columns: contribution.user, contribution.repository, line_count, full_name
    if (user.id !== '' && user.login !== '') {
        condition = `"user".id = ${user.id} OR "user".login = '${user.login}'`;
        columns = 'contribution.user, contribution.repository, line_count, full_name';
    };

    // IF only the repository provided -> list all contributions made to the given repository
    // WHERE repository.id = repositoryID OR repository.full_name = full_name
    // Columns: "user".id, "user".login, line_count
    if (repository.id !== '' && repository.full_name !== '') {
        condition = `repository.id = ${repository.id} OR full_name = ${repository.full_name}`;
        columns = '"user".id, login, line_count';
    };

    // If both params provided -> list all contributions by a user to a single repository
    // WHERE "user".id = userID OR "user".login = login AND repository.id = repositoryID OR repository.full_name = full_name
    // Columns: line_count, full_name, login
    /*if ((repository !== {id: '', login: ''}) && (user !== {id: '', full_name: ''})) {
        condition = `
            (repository.id = ${repository.id} OR "user".login = ${repository.full_name}) AND
            ("user".id = ${user.id} OR login = ${user.login})
        `;
        columns = 'line_count, full_name, login';
    };*/

    const both = await db.raw(`
        SELECT ${columns} FROM contribution
        LEFT JOIN "user" ON contribution."user" = "user".id
        LEFT JOIN repository ON contribution.repository = repository.id
        WHERE ${condition}
    `);

    return both;
}

module.exports = {
    insert,
    insertOrReplace,
    read
};
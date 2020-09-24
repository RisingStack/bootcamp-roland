const Router = require('koa-router');
const router = new Router();

const userSchema = require('./db/models/user');
const repositorySchema = require('./db/models/repository');
const contributionSchema = require('./db/models/contribution');

router.get('/hello', (ctx) => ctx.body = 'Hello World !');

// Repository
router.get('/repository/:id', async (ctx) => {
    try {
        ctx.body = await repositorySchema.read({ id: ctx.params.id });
    } catch (err) {
        ctx.status = 403;
    }
});
router.get('/repository', async (ctx) => {
    try {
        ctx.body = await repositorySchema.read(ctx.query);
    } catch (err) {
        ctx.status = 403;
    }
});

router.post('/repository', async (ctx) => {
    const { id, owner, full_name, html_url, description, language, stargazers_count } = ctx.request.body;
    ctx.body = await repositorySchema.insert({ id, owner, full_name, html_url, description, language, stargazers_count });
});

// User
router.get('/users/:id', async (ctx) => ctx.body = await userSchema.read({ id: ctx.params.id }));
router.get('/users', async (ctx) => ctx.body = await userSchema.read(ctx.query));

router.post('/user', async (ctx) => {
    const { id, login, avatar_url, html_url, type } = ctx.request.body;
    ctx.body = await userSchema.insert({ id, login, avatar_url, html_url, type });
});

// Contribution
// router.get('/contribution', async (ctx) => {
//     const user = { id: ctx.query.userID, login: ctx.query.login };
//     const repository = { id: ctx.query.repositoryID, full_name: ctx.query.full_name };
//     ctx.body = await contributionSchema.read({ user, repository });
// });

// router.post('/contribution', async (ctx) => {
//     const { repository, user, line_count } = ctx.request.body;
//     ctx.body = await contributionSchema.insertOrReplace({ repository, user, line_count });
// });

module.exports = router;
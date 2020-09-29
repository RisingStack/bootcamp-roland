const Router = require('koa-router');

const user = require('./db/models/user');
const repository = require('./db/models/repository');
const contributionSchema = require('./db/models/contribution');

const router = new Router();

router.get('/hello', (ctx) => ctx.body = 'Hello World !');

// Repository
router.get('/repository/:id', async (ctx) => {
    try {
        ctx.body = await repository.read({ id: ctx.params.id });
    } catch {
        ctx.status = 500;
    }
});
router.get('/repository', async (ctx) => {
    try {
        ctx.body = await repository.read(ctx.query);
    } catch {
        ctx.status = 500;
    }
});

router.post('/repository', async (ctx) => {
    const { error, value } = repository.schema.validate(ctx.request.body);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }

    try {
        ctx.body = await repository.insert(value);
    } catch (err) {
        ctx.status = 500;
    }
});

// User
router.get('/users/:id', async (ctx) => {
    console.log(ctx.params.id);
    try {
        ctx.body = await user.read({ id: ctx.params.id });
    } catch {
        ctx.status = 500;
    }
});

router.get('/users', async (ctx) => {
    try {
        ctx.body = await user.read(ctx.query);
    } catch {
        ctx.status = 500;
    }
});

router.post('/user', async (ctx) => {
    const { error, value } = user.schema.validate(ctx.request.body);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }
    try {
        ctx.body = await user.insert(value);
    } catch (err) {
        ctx.status = 500;
    }
});

// Contribution
router.get('/contribution', async (ctx) => {
    

    const user = { id: ctx.query.userID, login: ctx.query.login };
    const repository = { id: ctx.query.repositoryID, full_name: ctx.query.full_name };
    const response = await contributionSchema.read({user, repository});
    ctx.body = response;
});

// router.post('/contribution', async (ctx) => {
//     const { repository, user, line_count } = ctx.request.body;
//     ctx.body = await contributionSchema.insertOrReplace({ repository, user, line_count });
// });

module.exports = router;
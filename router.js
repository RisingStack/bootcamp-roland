const Router = require('koa-router');
const Joi = require('joi');

const user = require('./db/models/user');
const repository = require('./db/models/repository');
const contribution = require('./db/models/contribution');

const router = new Router();

const userSchema = Joi.object({
    id: Joi.number().integer(),
    login: Joi.string(),
    avatar_url: Joi.string().uri(),
    html_url: Joi.string().uri(),
});

const repositorySchema = Joi.object({
    id: Joi.number().integer(),
    full_name: Joi.string(),
    stargazers_count: Joi.number().integer(),
    html_url: Joi.string().uri({ scheme: 'https://github.com' }),
    description: Joi.string(),
    language: Joi.string()
});

router.get('/hello', (ctx) => ctx.body = 'Hello World !');

// Repository
router.get('/repository/:id', async (ctx) => {
    const { value, error } = Joi.attempt(ctx.params.id, Joi.number().integer());
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }

    try {
        ctx.body = await repository.read({ id: value });
    } catch {
        ctx.status = 500;
    }
});
router.get('/repository', async (ctx) => {
    const { value, error } = repositorySchema.validate(ctx.query);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }
    try {
        ctx.body = await repository.read(value);
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
    const { value, error } = Joi.attempt(ctx.params.id, Joi.number().integer());
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }
    try {
        ctx.body = await user.read({ id: value });
    } catch {
        ctx.status = 500;
    }
});

router.get('/users', async (ctx) => {
    const { value, error } = userSchema.validate(ctx.query);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }
    try {
        ctx.body = await user.read(value);
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

    try {
        Joi.attempt(user, userSchema);
        Joi.attempt(repository, repositorySchema);
    } catch (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }

    try {
        const response = await contribution.read({ user, repository });
        ctx.body = response;
    } catch {
        ctx.status = 500;
        return;
    }
});

router.post('/contribution', async (ctx) => {
    const { value, error } = contribution.schema.validate(ctx.request.body);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }

    try {
        ctx.body = await contribution.insert(value);
    } catch {
        ctx.status = 500;
    }
});

router.put('/contribution', async (ctx) => {
    const { value, error } = contribution.schema.validate(ctx.request.body);
    if (error) {
        ctx.body = error.message;
        ctx.status = 403;
        return;
    }

    try {
        ctx.body = await contribution.insertOrReplace(value);
    } catch {
        ctx.status = 500;
    }
});

module.exports = router;
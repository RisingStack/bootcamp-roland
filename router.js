const router = require('express').Router();
const Joi = require('joi');

const user = require('./db/models/user');
const repository = require('./db/models/repository');
const contribution = require('./db/models/contribution');
const config = require('./config');

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

router.get('/hello', (req, res, next) => res.send('Hello World !'));

// Repository
router.get('/repository/:id', async (req, res, next) => {
    const id = req.params.id;

    try {
        Joi.assert({ id }, userSchema);
    } catch (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        const response = await repository.read({ id });
        res.json(response);
    } catch (error) {
        next(error);
    }

});

router.get('/repository', async (req, res, next) => {
    const { value, error } = repositorySchema.validate(req.query);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        const response = await repository.read(value);
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/repository', async (req, res, next) => {
    const { error, value } = repository.schema.validate(req.body);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        const response = await repository.insert(value);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

// User
router.get('/users/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        Joi.attempt(id, Joi.number().integer());
    } catch (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        response = await repository.read({ id });
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.get('/users', async (req, res, next) => {
    const { value, error } = userSchema.validate(req.query);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        const response = await user.read(value);
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/user', async (req, res, next) => {
    const { error, value } = user.schema.validate(req.body);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        await user.insert(value);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

// Contribution
router.get('/contribution', async (req, res, next) => {
    const user = { id: req.query.userID, login: req.query.login };
    const repository = { id: req.query.repositoryID, full_name: req.query.full_name };

    try {
        Joi.attempt(user, userSchema);
        Joi.attempt(repository, repositorySchema);
    } catch (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        const response = await contribution.read({ user, repository });
        res.json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/contribution', async (req, res, next) => {
    const { value, error } = contribution.schema.validate(req.body);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }
    try {
        await contribution.insert(value);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

router.put('/contribution', async (req, res, next) => {
    const { value, error } = contribution.schema.validate(req.body);
    if (error) {
        error.statusCode = 403;
        next(error);
        return;
    }

    try {
        await contribution.insertOrReplace(value);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
});

module.exports = router;

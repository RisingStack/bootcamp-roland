const router = require('express').Router();
const Joi = require('joi');

const user = require('./db/models/user');
const repository = require('./db/models/repository');
const contribution = require('./db/models/contribution');

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

router.get('/hello', (req, res) => res.send('Hello World !'));

// Repository
router.get('/repository/:id', async (req, res) => {
    const id = req.params.id;
    try {
        Joi.attempt(id, Joi.number().integer());
    } catch (error) {
        res.status(403).send(error.message);
    }
    try {
        response = await repository.read({ id });
        res.json(response);
    } catch {
        res.status(500).end();
    }
});

router.get('/repository', async (req, res) => {
    const { value, error } = repositorySchema.validate(req.query);
    if (error) {
        res.status(403).send(error.message);
    }
    try {
        const response = await repository.read(value);
        res.json(response);
    } catch {
        res.status(500);
    }
});

router.post('/repository', async (req, res) => {
    const { error, value } = repository.schema.validate(req.body);
    if (error) {
        res.status(403).send(error.message);
    }
    try {
        await repository.insert(value);
        res.status(200).end();
    } catch (err) {
        res.status(500).end();
    }
});

// User
router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        Joi.attempt(id, Joi.number().integer());
    } catch (error) {
        res.status(403).send(error.message);
    }
    try {
        response = await repository.read({ id });
        res.json(response);
    } catch {
        res.status(500).end();
    }
});

router.get('/users', async (req, res) => {
    const { value, error } = userSchema.validate(req.query);
    if (error) {
        res.status(403).send(error.message);
    }
    try {
        const response = await user.read(value);
        res.json(response);
    } catch {
        res.status(500);
    }
});

router.post('/user', async (req, res) => {
    const { error, value } = user.schema.validate(req.body);
    if (error) {
        res.status(403).send(error.message);
    }
    try {
        await user.insert(value);
        res.status(200).end();
    } catch (err) {
        res.status(500).end();
    }
});

// Contribution
router.get('/contribution', async (req, res) => {
    const user = { id: req.query.userID, login: req.query.login };
    const repository = { id: req.query.repositoryID, full_name: req.query.full_name };

    try {
        Joi.attempt(user, userSchema);
        Joi.attempt(repository, repositorySchema);
    } catch (error) {
        res.status(403).send(error.message);
    }
    try {
        const response = await contribution.read({ user, repository });
        res.json(response);
    } catch {
        res.status(500).end();
    }
});

router.post('/contribution', async (req, res) => {
    const { value, error } = contribution.schema.validate(req.body);
    if (error) {
        res.status(403).send(error.message);
    }
    try {
        await contribution.insert(value);
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
});

router.put('/contribution', async (req, res) => {
    const { value, error } = contribution.schema.validate(req.body);
    if (error) {
        res.status(403).send(error.message);
    }

    try {
        await contribution.insertOrReplace(value);
        res.status(200).end();
    } catch {
        res.status(500).end();
    }
});

module.exports = router;

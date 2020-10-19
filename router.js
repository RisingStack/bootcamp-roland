const router = require('express').Router();
const Joi = require('joi');

const userModel = require('./db/models/user');
const repositoryModel = require('./db/models/repository');
const contributionModel = require('./db/models/contribution');
const auth = require('./authenticator');

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
  language: Joi.string(),
});

router.get('/hello', (req, res) => res.send('Hello World !'));

// Repository
router.get('/repository/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    Joi.assert({ id }, userSchema);
  } catch (error) {
    error.statusCode = 403;
    return next(error);
  }
  try {
    const response = await repositoryModel.read({ id });
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

router.get('/repository', async (req, res, next) => {
  const { value, error: validationError } = repositorySchema.validate(req.query);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }
  try {
    const response = await repositoryModel.read(value);
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

router.post('/repository', auth, async (req, res, next) => {
  const { value, error: validationError } = repositoryModel.schema.validate(req.body);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }
  try {
    const response = await repositoryModel.insert(value);
    res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
});

// User
router.get('/users/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    Joi.attempt(id, Joi.number().integer());
  } catch (error) {
    error.statusCode = 403;
    return next(error);
  }
  try {
    const response = await repositoryModel.read({ id });
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

router.get('/users', async (req, res, next) => {
  const { value, error: validationError } = userSchema.validate(req.query);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }
  try {
    const response = await userModel.read(value);
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

router.post('/user', auth, async (req, res, next) => {
  const { value, error: validationError } = userModel.schema.validate(req.body);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }
  try {
    await userModel.insert(value);
    res.status(200).end();
  } catch (error) {
    return next(error);
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
    return next(error);
  }
  try {
    const response = await contributionModel.read({ user, repository });
    res.json(response);
  } catch (error) {
    return next(error);
  }
});

router.post('/contribution', auth, async (req, res, next) => {
  const { value, validationError } = contributionModel.schema.validate(req.body);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }
  try {
    await contributionModel.insert({
      user: value.user,
      repository: value.repository,
      line_count: value.lineCount,
    });
    res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

router.put('/contribution', auth, async (req, res, next) => {
  const { value, validationError } = contributionModel.schema.validate(req.body);
  if (validationError) {
    validationError.statusCode = 403;
    return next(validationError);
  }

  try {
    await contributionModel.insertOrReplace(value);
    res.status(200).end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

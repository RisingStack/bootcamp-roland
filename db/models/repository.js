const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
  owner: Joi.number().integer().required(),
  full_name: Joi.string().required(),
  stargazers_count: Joi.number().integer().required(),
  html_url: Joi.string().allow(''),
  description: Joi.string().allow(''),
  language: Joi.string(),
});

const insert = data => db('repository').insert(data);

const read = params => db('repository').where(params).select();

module.exports = {
  insert,
  read,
  schema,
};

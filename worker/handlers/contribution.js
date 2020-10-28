const redis = require('redis');

const redisConfig = require('../config');
const logger = require('../../logger');

const client = redis.createClient(redisConfig);

function onContribution(query){

}

module.exports = {
  onContribution,
};

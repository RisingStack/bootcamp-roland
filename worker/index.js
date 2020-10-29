const redis = require('redis');

const redisConfig = require('./config');
const logger = require('../logger');
const { onRepository } = require('./handlers/repositroy');
const { onContribution } = require('./handlers/contribution');

const channels = {
  trigger: 'trigger',
  repository: 'repository',
  contribution: 'repository',
};

const initRedisClient = () => (redis.createClient(redisConfig));

const repositorySubscriber = initRedisClient();
const contributionSubscriber = initRedisClient();

function initChannels() {
  repositorySubscriber.subscribe(channels.trigger, () => logger.info('Repository channel subscribed'));
  contributionSubscriber.subscribe(channels.repository, () => logger.info('Contribution channel subscribed'));

  repositorySubscriber.on('message', async (channel, message) => {
    logger.info(`[REPOSITORY] Message received on ${channel} channel`);
    logger.info(`[REPOSITORY] Message: ${message}`);
    onRepository(message);
  });

  contributionSubscriber.on('message', (channel, message) => {
    logger.info(`[CONTRIBUTION] Message received on ${channel} channel`);
    onContribution(message);
  });
}

module.exports = {
  channels,
  initChannels,
  initRedisClient,
};

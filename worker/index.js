const redis = require('redis');

const redisConfig = require('./config');
const logger = require('../logger');
const { onRepository } = require('./handlers/repositroy');
const { onContribution } = require('./handlers/contribution');

const channels = {
  trigger: 'trigger',
  repository: 'repository',
  contribution: 'contribution',
};

const triggerPublisher = redis.createClient(redisConfig);
const repositorySubscriber = redis.createClient(redisConfig);
const repositoryPublish = redis.createClient(redisConfig);
const contributionSubscriber = redis.createClient(redisConfig);

repositorySubscriber.on('subscribe', () => {
  triggerPublisher.publish(channels.trigger, process.env.TRIGGER_QUERY,
    () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
});

repositorySubscriber.on('message', (channel, message) => {
  logger.info(`[REPOSITORY] Message received on ${channel} channel`);
  logger.info(`[REPOSITORY] Message: ${message}`);
  onRepository(message).then(repository => {
    repositoryPublish.publish(channels.repository, JSON.stringify(repository),
      () => logger.info(`Message sent to ${channels.repository} channel`));
  }).catch(error => {
    logger.error(error);
    process.exit(1);
  });
});

contributionSubscriber.on('message', (channel, message) => {
  logger.info(`[CONTRIBUTION] Message received on ${channel} channel`);
  onContribution(message).then(() => {
    logger.info('Trigger script completed successfully!');
    process.exit(0);
  }).catch(error => {
    logger.error(error);
    process.exit(1);
  });
});

module.exports = {
  channels,
  triggerPublisher,
  contributionSubscriber,
  repositorySubscriber,
};

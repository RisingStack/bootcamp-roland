const redis = require('redis');
const Joi = require('joi');

const redisConfig = require('../config');
const logger = require('../../logger');
const { channels } = require('../index');

function onTrigger(message) {
  if (!message) {
    logger.info('Misisng query parameter!');
    process.exit(1);
  }

  const client = redis.createClient(redisConfig);

  client.pubsub('channels', (error, activeChannels) => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }
    try {
      Joi.assert(activeChannels, Joi.array().items(
        Joi.string().valid(channels.repository),
        Joi.string().valid(channels.contribution),
      ));
    } catch (err) {
      logger.error('Channels not subscribed!');
      logger.error(err);
      process.exit(1);
    }
  });

  client.publish(channels.repository, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
  client.quit();
}

module.exports = {
  onTrigger,
};

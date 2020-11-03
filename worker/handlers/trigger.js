const redis = require('redis');

const redisConfig = require('../config');
const logger = require('../../logger');
const { channels } = require('../index');

function onTrigger(message) {
  if (!message) {
    logger.info('Misisng query parameter');
    process.exit(1);
  }

  const client = redis.createClient(redisConfig);
  client.publish(channels.repository, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
  client.quit();
}

module.exports = {
  onTrigger,
};

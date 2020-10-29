const logger = require('../../logger');
const { initRedisClient, channels } = require('../index');

function onTrigger(message) {
  if (!message) throw Error('Misisng query parameter');

  const client = initRedisClient();
  client.publish(channels.trigger, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
}

module.exports = {
  onTrigger,
};

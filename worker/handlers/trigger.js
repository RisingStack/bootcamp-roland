const logger = require('../../logger');
const { initRedisClient, channels } = require('../index');

function onTrigger(message) {
  if (!message) throw Error('Misisng query parameter');

  const client = initRedisClient();
  client.publish(channels.repository, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
  client.quit();
}

module.exports = {
  onTrigger,
};

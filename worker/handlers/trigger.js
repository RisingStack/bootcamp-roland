const logger = require('../../logger');
const { initPublisher, channels } = require('../index');

function onTrigger(message) {
  if (!message) throw Error('Misisng query parameter');

  const client = initPublisher();
  client.publish(channels.trigger, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
}

module.exports = {
  onTrigger,
};

const logger = require('../../logger');
const { channels, triggerPublisher } = require('../index');

function onTrigger(message) {
  if (!message) {
    logger.error('Misisng query parameter!');
    process.exit(1);
  }

  triggerPublisher.publish(channels.repository, message, () => logger.info(`Trigger message sent to ${channels.trigger} channel`));
}

module.exports = {
  onTrigger,
};

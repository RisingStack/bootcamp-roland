const logger = require('../logger');
const {
  repositorySubscriber,
  contributionSubscriber,
  channels,
} = require('../worker/index');

logger.info('Initiating trigger script');

if (!process.env.TRIGGER_QUERY) {
  logger.error('Missing TRIGGER_QUERY env variable!');
  process.exit(1);
}

logger.info('Subscribing channels');

repositorySubscriber.subscribe(channels.trigger, () => logger.info(`Repository channel subscribed to ${channels.trigger}`));
contributionSubscriber.subscribe(channels.repository, () => logger.info(`Contribution channel subscribed to ${channels.repository}`));

const logger = require('../logger');
const { initChannels } = require('../worker/index');
const { onTrigger } = require('../worker/handlers/trigger');

logger.info('Initiating trigger script');

if (!process.env.TRIGGER_QUERY) {
  logger.error('Missing TRIGGER_QUERY env variable!');
  process.exit(1);
}

logger.info('Initiating channels');
initChannels();

logger.info('Sending trigger message');
onTrigger(process.env.TRIGGER_QUERY);

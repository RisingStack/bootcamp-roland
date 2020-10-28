const logger = require('../logger');
const { initChannels } = require('../worker/index');
const { onTrigger } = require('../worker/handlers/trigger');

logger.info('Initiating trigger script');

if (!process.env.TRIGGER_QUERY) throw Error('Missing TRIGGER_QUERY env variable!');

logger.info('Initiating channels');
initChannels();

logger.info('Sending trigger message');
onTrigger(process.env.TRIGGER_QUERY);

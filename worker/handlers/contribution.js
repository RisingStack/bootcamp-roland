const logger = require('../../logger');

function onContribution(query) {
  logger.info(query);
}

module.exports = {
  onContribution,
};

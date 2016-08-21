const db = require('./db');
const logger = require('winston');
const CronJob = require('cron').CronJob;

const CRON_DEF = '0 */15 * * * *';

db.connect()
  .then(() => {
    logger.info('Mongoose connection established...');
    logger.info(`${CRON_DEF} CronJob starting to parse feeds...`);
  })
  .then(() => new CronJob(CRON_DEF, () => {
    logger.info(Date.now());
  }, null, true, 'America/Los_Angeles'))
  .catch(logger.error);

// http://theholmesoffice.com/mongoose-connection-best-practice/
const shutdown = function shutdown(msg, cb) {
  return function gracefulShutdown() {
    db.connection.close(() => {
      logger.info(`Mongoose disconnected through ${msg}`);
      cb();
    });
  };
};

process.once('SIGUSR2', shutdown('Nodemon Restart', () => process.kill(process.pid, 'SIGUSR2')));
process.on('SIGINT', shutdown('App Termination', () => process.exit(0)));
process.on('SIGTERM', shutdown('Heroku App Termination', () => process.exit(0)));

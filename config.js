require('dotenv-safe').config();

const config = {
  port: process.env.PORT || 3000,
  githubToken: process.env.GITHUBTOKEN,
  jwt: process.env.JWT,
  dbHost: process.env.DBHOST,
  dbUser: process.env.NODE_ENV === 'test' ? 'postgres' : process.env.DBUSER,
  dbPassword: process.env.NODE_ENV === 'test' ? 'mysecretpassword' : process.env.DBPASSWORD,
  db: process.env.NODE_ENV === 'test' ? 'test' : process.env.DB,
  redis: {
    host: process.env.REDIS_PORT,
    port: process.env.REDIS_HOST,
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
};

module.exports = config;

require('dotenv-safe').config();

const config = {
    port: process.env.PORT || 3000,
    githubToken: process.env.GITHUBTOKEN,
    dbHost: process.env.DBHOST,
    dbUser: process.env.DBUSER,
    dbPassword: process.env.DBPASSWORD,
    db: process.env.DB
};

module.exports = config;

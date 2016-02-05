var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'moregraspapp'
    },
    port: 3000,
    db: 'mongodb://localhost/mg-registration-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'moregraspapp'
    },
    port: 3000,
    db: 'mongodb://localhost/mg-registration-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'moregraspapp'
    },
    port: 8081,
    db: 'mongodb://localhost/mg-registration-production'
  }
};

module.exports = config[env];

/**
 * Module dependencies
 */

var stack = require('poe-ui/server');
var envs = require('envs');
var auth = require('./lib/auth');

/**
 * Create a poe-auth server
 */

module.exports = function(opts) {
  opts = opts || {};

  var app = stack('/', opts);

  app.auth = auth(opts);

  app.useBefore('router', '/', 'auth', app.auth);

  return app;
};

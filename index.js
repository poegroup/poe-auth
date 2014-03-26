/**
 * Module dependencies
 */

var stack = require('simple-stack-common');
var oauth = require('./lib/oauth');
var envs = require('envs');

/**
 * Forwarding headers
 */

var headers = {
  host: 'x-orig-host',
  path: 'x-orig-path',
  port: 'x-orig-port',
  proto: 'x-orig-proto'
};

/**
 * Create a poe-auth server
 */

module.exports = function(options) {
  options = options || {};

  var app = stack({
    base: headers
  });

  app.set('view engine', 'jade');

  app.useBefore('router', function locals(req, res, next) {
    res.locals.base = req.base;
    res.locals.site = req.get('x-ui-url') || envs('SITE_URL');
    next();
  });

  return app;
};

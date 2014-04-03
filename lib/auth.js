/**
 * Module dependencies
 */

var debug = require('debug')('poe-auth:auth');
var consulate = require('consulate');
var token = require('consulate-simple-secrets');
var validate = require('consulate-validate-redirect-uri');
var authcode = require('consulate-authcode-simple-secrets');
var authcodeRedis = require('consilate-authcode-simple-secrets-redis');
var scrypt = require('consulate-scrypt');
var scopes = require('consulate-scopes-env');
var envs = require('envs');

module.exports = function(opts) {
  var auth = consulate({
    session: {
      secret: envs('COOKIE_SECRET', '442ba211d3d0a062de00d5e317f133f139ce8f0e19b2af943229535ac09a42d5')
    }
  });

  auth.plugin(token({
    key: opts.accessTokenKey || envs('ACCESS_TOKEN_KEY')
  }));

  auth.plugin(validate());

  auth.plugin(authcode({
    key: envs('AUTH_CODE_KEY')
  }, authcodeRedis({
    url: envs('AUTH_CODE_REDIS_URL')
  })));

  auth.plugin(scrypt());

  auth.plugin(scopes({
    placeholder: envs('SCOPES_PLACEHOLDER', '_')
  }));

  auth.loginView(function(req, res) {
    res.render('login', {title: 'Login'});
  });

  auth.authorizeView(function(req, res) {
    res.render('authorize', {title: 'Authorize'});
  });

  auth.get('/logout', function(req, res) {
    req.logout();
    res.redirect(res.locals.home || req.base);
  });

  return auth;
};

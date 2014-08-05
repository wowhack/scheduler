var express = require('express');
var secret = require('../source/secret');
var querystring = require('querystring');
var state_key = 'spotify_auth_state';

function get_login(settings, req, res) {
  var state = secret(16);
  res.cookie(state_key, state);

  res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: settings.client_id,
    redirect_uri: settings.redirect_uri,
    scope: settings.scope,
    state: state
  }));
}

module.exports = function(settings) {
  var router = express.Router();
  router.get('/login', get_login.bind(
      undefined,
      settings));
  return router;
};

module.exports.state_key = state_key;

var express = require('express');
var request = require('request');
var querystring = require('querystring');

function get_auth_callback(settings, login, req, res) {
  var stored_state = req.cookies && req.cookies[login.state_key];
  if (!req.query.state || stored_state !== req.query.state) {
    var query = querystring.stringify({ error: 'state_mismatch' });
    var redirect = redirect_template.replace('{?}', '?' + query);
    res.redirect(redirect)
    return;
  }

  res.clearCookie(login.state_key);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code || null,
      redirect_uri: settings.redirect_uri,
      grant_type: 'authorization_code',
      client_id: settings.client_id,
      client_secret: settings.client_secret
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    var redirect_template = req.cookies[login.redir_key];
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;

      var query = querystring.stringify({ access_token: access_token });
      var redirect = redirect_template.replace('{?}', '?' + query);
      res.redirect(redirect)
    } else {
      var query = querystring.stringify({ error: 'invalid_token' });
      var redirect = redirect_template.replace('{?}', '?' + query);
      res.redirect(redirect)
    }
  });
}

module.exports = function(settings, login) {
  var router = express.Router();
  router.get('/auth_callback', get_auth_callback.bind(
      undefined,
      settings,
      login));
  return router;
};

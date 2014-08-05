var express = require('express');
var request = require('request');
var querystring = require('querystring');

function get_auth_callback(settings, state_key, req, res) {
  var stored_state = req.cookies && req.cookies[state_key];
  if (!req.query.state || stored_state !== req.query.state) {
    res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    return;
  }

  res.clearCookie(state_key);
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
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      var refresh_token = body.refresh_token;

      var options = {
        url: 'http://localhost:8888/artists?token=' + access_token,
        json: true
      };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
        console.log(body);
      });

      // we can also pass the token to the browser to make requests from there
      res.redirect('/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
}

module.exports = function(settings, state_key) {
  var router = express.Router();
  router.get('/auth_callback', get_auth_callback.bind(
      undefined,
      settings,
      state_key));
  return router;
};

var express = require('express');
var request = require('request');

function get_refresh_token(settings, req, res) {
  var client_string = settings.client_id + ':' + settings.client_secret;
  var refresh_token = req.query.refresh_token;
  var request_options = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + new Buffer(client_string).toString('base64') },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(request_options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({ 'access_token': access_token });
    }
  });
}

module.exports = function(settings) {
  var router = express.Router();
  router.get('/refresh_token', get_refresh_token.bind(
      undefined,
      settings));
  return router;
};

var express = require('express');
var request = require('request');

function get_artists(req, res, next) {
  var artists = {};
  var headers = { 'Authorization': 'Bearer ' + req.query.token };
  var token16 = req.query.token.substr(0, 16);

  function fetch(error, response, body) {
    if (error || response.statusCode !== 200) {
      next(error)
      return;
    }

    body.items.forEach(function(item) {
      (item.track.artists || []).forEach(function(artist) {
        if (artists[artist.uri]) {
          artists[artist.uri].count++;
        } else {
          artists[artist.uri] = { name: artist.name, count: 1 };
        }
      });
    });

    if (body.next) {
      request.get({ url: body.next, headers: headers, json: true }, fetch);
      return;
    }

    var count = Object.keys(artists).length;
    res.send(artists);
  };

  var url = 'https://api.spotify.com/v1/me/tracks?limit=50';
  request.get({ url: url, headers: headers, json: true }, fetch);
};

module.exports = function() {
  var router = express.Router();
  router.get('/artists', get_artists);
  return router;
};

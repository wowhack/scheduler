var request = require('request');

var cache = {};

function getArtists(token, cb) {
  var cachedData = cache[token];
  if (cachedData) {
    return cb(cachedData);
  }

  var artists = {};
  var headers = { 'Authorization': 'Bearer ' + token };
  var token16 = token.substr(0, 16);

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

    cache[token] = artists;
    cb(artists);
  };

  var url = 'https://api.spotify.com/v1/me/tracks?limit=50';
  request.get({ url: url, headers: headers, json: true }, fetch);
}

exports.getArtists = getArtists;

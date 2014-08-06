var express = require('express');
var request = require('request');
var artists = require('../source/artists');

function get_artists(req, res, next) {
  artists.getArtists(req.query.token, res.send.bind(res));
};

module.exports = function() {
  var router = express.Router();
  router.get('/artists', get_artists);
  return router;
};

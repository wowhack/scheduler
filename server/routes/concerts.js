var express = require('express');
var request = require('request');
var fs = require('fs');

var concerts = JSON.parse(String(fs.readFileSync(__dirname + "/../data/concerts.json")));

function get_concerts(req, res) {
  res.send({ concerts: concerts });
}

module.exports = function() {
  var router = express.Router();
  router.get('/concerts', get_concerts);
  return router;
};

var express = require('express');
var request = require('request');

function get_activities(req, res) {
  res.send({ 'hello': 'world' });
}

module.exports = function() {
  var router = express.Router();
  router.get('/activities', get_activities);
  return router;
};

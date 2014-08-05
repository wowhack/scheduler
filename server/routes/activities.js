var express = require('express');
var request = require('request');
var fs = require('fs');
var times = require("../source/times");
var distance = require("../source/distance");
var weights = require("../source/weights");
var activities = require("../source/activities");

var concerts = JSON.parse(String(fs.readFileSync(__dirname + "/../data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync(__dirname + "/../data/venues.json")));

function get_activities(req, res) {
  var mode = req.query.mode || "walking";
  var popularityWeight = parseFloat(req.query.popularity || "0.5");
  var distanceMultiplier = parseFloat(req.query.distance || "1");

  var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, mode, distanceMultiplier), concerts, weights.weightsForPopularity(concerts, 5, popularityWeight));
  res.send({ days: activities.scheduleToActivities(concerts, venues, mode, schedule) });
}

module.exports = function() {
  var router = express.Router();
  router.get('/activities', get_activities);
  return router;
};

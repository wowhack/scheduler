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
  var preferred = req.query.preferred ? req.query.preferred.split(',') : [];

  var durationMultiplier = 1;
  if (mode == "walking_slow") {
    durationMultiplier = 0.5;
    mode = "walking";
  }

  var preferredWeights = weights.constantWeights(100, preferred);
  var popularityWeight = weights.weightsForPopularity(concerts, 5, popularityWeight);
  var combinedWeights = weights.combineWeights(preferredWeights, popularityWeight);

  var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, mode, durationMultiplier), concerts, combinedWeights);
  res.send({ days: activities.scheduleToActivities(concerts, venues, mode, durationMultiplier, schedule) });
}

module.exports = function() {
  var router = express.Router();
  router.get('/activities', get_activities);
  return router;
};

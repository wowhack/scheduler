var fs = require("fs");
var times = require("../server/source/times");
var distance = require("../server/source/distance");

function giveweights(concerts) {
  var weights = new Object();
  for(var i in concerts){
    weights[concerts[i]['artist-id']] = 1;
  }
  return weights;
}

// Create a weights object that gives extra weight to small or large artists.
// size should be in 0..1. Size > 0.5 means prefer large artists.
// maxWeight is the most/least popular artist will have this times more or less weight
function weightsForPopularity(concerts, maxEffect, size) {
  var artists = {};
  concerts.forEach(function(concert) {
    // pop is rating, 0..1
    var pop = concert['artist-popularity'] / 100;
    // translatedPop is rating 0..1 that takes the size preference into account
    var translatedPop = (pop - 0.5) * (size - 0.5) * 2 + 0.5;

    var minValue = 1/maxEffect;
    var maxValue = maxEffect;

    var weight = (translatedPop * (maxValue - minValue)) + minValue;
    artists[concert['artist-id']] = weight;
  });
  return artists;
}

// Combine two weight objects by multiplying their values
function combineWeights(a, b) {
  var artists = {};
  for (var i in a) { artists[i] = true; }
  for (var i in b) { artists[i] = true; }

  var result = {};
  for (var artist in artists) {
    result[artist] = (a[artist] || 1) * (b[artist] || 1);
  }
  return result;
}

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));

var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, "walking"), concerts, weightsForPopularity(concerts, 5, 0));
console.log(schedule.map(function(artist) {
  var artists = {};
  concerts.forEach(function(concert) {
    artists[concert['artist-id']] = concert['artist-popularity'];
  })
  return { artist: artist, pop: artists[artist] };
}));

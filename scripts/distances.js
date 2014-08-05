// Script that was used to get distances between different venues.
// It's no longer useful, and only here for reference.

var fs = require("fs");
var http = require("http");

var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));

function makeRequest(url, cb) {
  http.get(url, function(res) {
    var str = '';
    res.on('data', function (chunk) {
      str += chunk;
    });
    res.on('end', function () {
      cb(str);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}

function requestDistanceAndDuration(url, cb) {
  makeRequest(url, function(str) {
    var obj = JSON.parse(str);
    var route = obj && obj.routes[0];
    var legs = route && route.legs;

    if (!legs) {
      console.log("Fail", str);
      return cb(null);
    }

    var distance = 0;
    var duration = 0;

    legs.forEach(function(leg) {
      distance += leg.distance.value;
      duration += leg.duration.value;
    });

    cb({ distance: distance, duration: duration });
  });
}

function mapsUrl(from, to, mode) {
  return "http://maps.googleapis.com/maps/api/directions/json?origin="+from.latitude+","+from.longitude+"&destination="+to.latitude+","+to.longitude+(mode ? "&mode="+mode : '');
}

var modes = ["driving", "walking", "bicycling"];

function forEachValue(obj, cb) {
  for (var key in obj) {
    cb(obj[key], key);
  }
}

var combinations = [];

forEachValue(venues, function(venue, name) {
  venue.distances = venue.distances || {};

  forEachValue(venues, function(otherVenue, otherName) {
    modes.forEach(function(mode) {
      combinations.push({ fromName: name, from: venue, to: otherVenue, toName: otherName, mode: mode });
    });
  });
});

var skipped = 0;

(function doIteration(iteration) {
  if (iteration >= combinations.length) {
    finish();
    return;
  }
  console.log("At iteration "+iteration+" of "+combinations.length);

  var combination = combinations[iteration];

  if (combination.toName == combination.fromName) {
    skipped++;
    return doIteration(iteration + 1);
  }

  var venue = combination.from;
  venue.distances = venue.distances || {};
  var modeDict = venue.distances[combination.mode] || {};
  venue.distances[combination.mode] = modeDict;
  if (combination.to.distances && combination.to.distances[combination.mode] && combination.to.distances[combination.mode][combination.fromName]) {
    modeDict[combination.toName] = combination.to.distances[combination.mode][combination.fromName];
    skipped++;
    return doIteration(iteration + 1);
  }

  var url = mapsUrl(combination.from, combination.to, combination.mode);
  setTimeout(function() {
    requestDistanceAndDuration(url, function(value) {
      console.log(url, value);
      if (value !== null) {
        modeDict[combination.toName] = value;
      }
      doIteration(iteration + 1);
    });
  }, 1500);
})(0);

function finish() {
  console.log("Skipped "+skipped);
  console.log(JSON.stringify(venues, null, 2));
}

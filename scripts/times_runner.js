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

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));

var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, "walking"), concerts, giveweights(concerts));
console.log(schedule.length);

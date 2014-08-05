var fs = require("fs");
var times = require("../server/source/times");

function failDistance(a, b) {
  console.log("failDistance fail", a, b);
  if (a == b) return 0;
  else return 1;
}

function distance(venues, mode, a, b) {
  // return time in minutes to travel between a and b
  if (a == b) return 0;

  var distancesFromA = venues[a].distances[mode];
  if (!distancesFromA || !(b in distancesFromA)) return failDistance(a, b);

  return distancesFromA[b].duration;
}

function giveweights(concerts) {
  var weights = new Object();
  for(var i in concerts){
    weights[concerts[i]['artist-id']] = 1;
  }
  return weights;
}

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("data/venues.json")));

var schedule = times.findOptimalSchedule(distance.bind(undefined, venues, "walking"), concerts, giveweights(concerts));
console.log(schedule.length);

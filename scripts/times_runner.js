var fs = require("fs");
var times = require("./times");

function distance(a, b) {
  // return time in minutes to travel between a and b
  if(a == b) return 0;
  else return 1;
}

function giveweights(concerts) {
  var weights = new Object();
  for(var i in concerts){
    weights[concerts[i]['artist-id']] = 1;
  }
  return weights;
}

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
console.log(times.findOptimalSchedule(distance, concerts, giveweights(concerts)));


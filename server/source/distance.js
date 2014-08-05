// Utilities for feeding the scheduling algorithm with distances

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

function makeDistanceFunction(venues, mode) {
  return distance.bind(undefined, venues, "walking");
}

module.exports.distance = distance;
module.exports.makeDistanceFunction = makeDistanceFunction;
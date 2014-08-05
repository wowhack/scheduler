// File with utilities for weights that are supplied to the scheduler function

function unityWeights(concerts) {
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

exports.unityWeights = unityWeights;
exports.weightsForPopularity = weightsForPopularity;
exports.combineWeights = combineWeights;
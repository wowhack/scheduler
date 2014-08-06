var fs = require("fs");

var relation = JSON.parse(String(fs.readFileSync(__dirname + "/../data/relation.json")));

var minDistance = 0.3;

function extractBase62Id(id) {
  return id.replace(/^spotify:artist:/, '');
}

function calculateWeights(concerts, myArtists) {
  var weights = {};
  concerts.forEach(function(concert) {
    var weight = 0;
    concert['spotify-uris'].forEach(function(concertArtistId) {
      Object.keys(myArtists).forEach(function(myArtistId) {
        var distance = relation[extractBase62Id(concertArtistId)][extractBase62Id(myArtistId)];
        if (typeof distance === 'number') {
          weight += 1/Math.max(minDistance, distance);
        }
      });
    });

    weights[concert['artist-id']] = 1 + weight * 5;
  });

  return weights;
}

exports.calculateWeights = calculateWeights;

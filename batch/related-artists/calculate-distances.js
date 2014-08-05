var cacheDir = 'cache';
var path = require('path');
var fs = require('fs');
var data = {}

function readFile(id) {
  if (id in data) {
    return data[id];
  }
  var artist = JSON.parse(fs.readFileSync(path.join(cacheDir, id + '.json')));
  artist.related = artist.related.reduce(function(result, relation, index) {
    result[relation.id] = index;
    return result;
  }, {});

  data[id] = artist;
  return artist;
}

function distance(x, y) {
  if (x === y) {
    return 0;
  }
  var x = readFile(x);
  var y = readFile(y);
  if (y.id in x.related) {
    var index = x.related[y.id];
    return (index ? (1.0 / index) + 1.0 : 1.0);
  }
  return Infinity;
}

fs.readdir(cacheDir, function(err, files) {
  var distances = {}
  var keys = files.map(function(file) {
    return file.replace('.json', '');
  });

  keys.forEach(function(x) {
    distances[x] = {};
    keys.forEach(function(y) {
      distances[x][y] = distance(x, y);
    });
  });

  keys.forEach(function(x) {
    console.log(keys.indexOf(x) + ' of ' + keys.length + ' artists done');
    keys.forEach(function(y) {
      keys.forEach(function(z) {
        var alternativeDistance = distance(y, x) + distance(x, z);
        if (distance(y, z) > alternativeDistance) {
          distances[y][z] = alternativeDistance;
        }
      });
    });
  });

  var output = path.join(
    __dirname, '..', '..', 'server', 'data', 'relation.json');
  fs.writeFileSync(output, JSON.stringify(distances));
});

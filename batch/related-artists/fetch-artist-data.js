var exec = require('child_process').exec;
var fs = require('fs');
var os = require('os');
var path = require('path');
var when = require('when');

var maxDepth = 1;
var endpoint = 'hm://webapi-metadata/v1/artists/';
var cacheDir = 'cache';
var dataFile = path.join(__dirname, '..', '..', 'server', 'data', 'concerts.json');
var data = JSON.parse(fs.readFileSync(dataFile));

function jhurl(url) {
  var command = 'jhurl -p -z tcp://sjc1-apollowebapi-a2:5700 ' + url;
  return when.promise(function(resolve, reject) {
    console.log(command);
    var child = exec(command, function(error, stdout, stderr) {
      if (error) {
        reject(error);
      }
      var result = JSON.parse(stdout);
      if (result.error) {
        reject(new Error(result.error));
      }
      resolve(result);
    })
  });
}

function limitParallelInvocations(func, maxParallel) {
  var pending = [];
  var active = [];

  function invokePending() {
    var remaining = [];
    pending.forEach(function(deferred) {
      if (active.length < maxParallel) {
        active.push(deferred);
        deferred.resolve();
      } else {
        remaining.push(deferred);
      }
    });
    pending = remaining;
  }

  return function() {
    var args = arguments;
    var deferred = when.defer();
    pending.push(deferred);
    invokePending();
    return deferred.promise.then(function() {
      var result = func.apply(null, args).then(function(result) {
        active.splice(active.indexOf(deferred), 1);
        invokePending();
        return result;
      });
      return result;
    });
  };
}

var webApiRequest = limitParallelInvocations(jhurl, os.cpus().length * 1.5);

function ensureCacheDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function getCachedData(id) {
  var cacheFile = path.join(cacheDir, id + '.json');
  if (fs.existsSync(cacheFile)) {
    var stats = fs.statSync(cacheFile);
    if (stats.isFile(cacheFile)) {
      return JSON.parse(fs.readFileSync(cacheFile));
    }
  }
}

function cacheData(id, object) {
  ensureCacheDirExists(cacheDir);

  var cacheFile = path.join(cacheDir, id + '.json');
  fs.writeFileSync(cacheFile, JSON.stringify(object));
}

function getArtistId(artistUri) {
  if (artistUri.indexOf('spotify:artist:') !== 0) {
    throw new Error('Not an artist URI: ' + artistUri);
  }
  return artistUri.replace('spotify:artist:', '');
}

function getRelatedArtists(id) {
  var url = endpoint + id + '/related-artists';
  return webApiRequest(url);
}

function getArtistDetails(id) {
  var url = endpoint + id;
  return webApiRequest(url);
}

function spiderRelated(artist, depth, visited) {
  if (!artist.related.length) {
    console.log('no related artists found: ', artist);
    return when.resolve([]);
  }
  var fetchRelated = [];
  artist.related.forEach(function(relatedArtist) {
    fetchRelated.push(spiderArtist(relatedArtist.id, depth + 1, visited));
  });
  return when.all(fetchRelated)
    .then(function(result) {
      return result.reduce(function(a, b) {
        return a.concat(b);
      });
    });
}

function spiderArtist(id, depth, visited) {
  depth = depth || 0;
  visited = visited || [];

  if (visited.indexOf(id) >= 0) {
    return when.resolve([]);
  }
  visited.push(id);
  console.log('Spidering artist: ', id);

  var getData;
  var cached = getCachedData(id);
  if (cached) {
    getData = when.resolve(cached);
  } else {
    var promises = [
      getArtistDetails(id),
      getRelatedArtists(id)
    ];
    getData = when.all([
      getArtistDetails(id),
      getRelatedArtists(id)
    ]).then(function(results) {
      var artistDetails = results[0];
      artistDetails.related = results[1].artists || [];
      cacheData(id, artistDetails);
      return artistDetails;
    })
  }

  return getData.then(function(artist) {
    if (depth === maxDepth) {
      return [artist]
    }
    return spiderRelated(artist, depth, visited).then(function(artists) {
      return artists.concat([artist]);
    });
  })
}

data.forEach(function(concert) {
  concert['spotify-uris'].forEach(function(artistUri) {
    var id = getArtistId(artistUri);
    spiderArtist(id).catch(function(error) {
      console.log('ERROR: ', error);
    }).then(function(artists) {
      console.log('Spidered ' + artists.length + ' nodes for artist: ' + id);
    });
  });
});

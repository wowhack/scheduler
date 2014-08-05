// Script that was used to get the poularity of artists.
// It's no longer useful, and only here for reference.

var fs = require("fs");
var https = require("https");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));

function makeRequest(url, cb) {
  https.get(url, function(res) {
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

function artistUrl(uri) {
  return "https://api.spotify.com/v1/artists/"+uri.replace(/spotify:artist:/,'');
}

function artistPopularity(uri, cb) {
  makeRequest(artistUrl(uri), function(str) {
    var obj = JSON.parse(str);

    cb(obj.popularity);
  });
}

function artistMaxPopularity(uris, cb) {
  var maxPop = 0;
  (function iterate(iter) {
    if (iter >= uris.length) {
      return cb(maxPop);
    }

    artistPopularity(uris[iter], function(pop) {
      maxPop = Math.max(pop, maxPop);
      iterate(iter+1);
    })
  })(0);
}

(function doIteration(iter) {
  console.log(iter);

  if (iter >= concerts.length) {
    fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2)+"\n");
    return;
  }

  artistMaxPopularity(concerts[iter]["spotify-uris"], function(pop) {
    concerts[iter]['artist-popularity'] = pop;
    doIteration(iter + 1);
  });
})(0);

var artists = require('./artists').data;
var request = require('request');
var fs = require('fs');

function download(uri, file_path, callback) {
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(file_path)).on('close', callback);
  });
};

artists.forEach(function(artist) {
  var img_url = 'http:' + artist.image.replace('/wayoutwest/', '/wayoutwest/media/');
  var artist_id = artist.slug;
  var file_path = __dirname + '/images/' + artist_id + '.jpg';

  console.log('Downloading "' + img_url + '" for "' + artist_id + '"...');
  download(img_url, file_path, function() {});
});

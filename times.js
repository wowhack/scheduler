// Script used to add concert end times to concerts.json

var fs = require("fs");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var concertTimes = JSON.parse(String(fs.readFileSync("data/concert_times.json")));

concerts.forEach(function(concert) {
  var times = concertTimes[concert["artist-id"]];
  if (times['start-time'] != concert['event-time']) throw new Error("hej");
  delete concert['event-time'];
  concert['start-time'] = times['start-time'];
  concert['end-time'] = times['end-time'];
});

console.log(JSON.stringify(concerts, null, 2));
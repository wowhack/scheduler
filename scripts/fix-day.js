// Script that was used to make day integers.
// It's no longer useful, and only here for reference.

var fs = require("fs");
var https = require("https");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));

function numbertime(s) {
  return Number(s[4]) + Number(10*s[3]) + Number(60*s[1]) + Number(600*s[0]);
}

concerts.forEach(function(concert) {
  switch(concert['event-day']){
    case 'onsdag':
      concert['event-day'] = -1;
      break;
    case 'torsdag':
      concert['event-day'] = 0;
      break;
    case 'fredag':
      concert['event-day'] = 1;
      break;
    case 'lördag':
      concert['event-day'] = 2;
      break;
  }
  if(concert['start-time'] < '08:00') concert['event-day']++;

  concert['start-time'] = 1440*concert['event-day'] + numbertime(concert['start-time']);
  concert['end-time'] = 1440*concert['event-day'] + numbertime(concert['end-time']);
  if (concert['end-time'] < concert['start-time']) concert['end-time'] += 1440;
});

fs.writeFileSync("data/concerts.json", JSON.stringify(concerts, null, 2)+"\n");

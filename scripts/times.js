var fs = require("fs");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var concertTimes = JSON.parse(String(fs.readFileSync("data/concert_times.json")));

function numbertime(s) {
	return Number(s[4]) + Number(10*s[3]) + Number(60*s[1]) + Number(600*s[0]);
}

concerts.forEach(function(concert) {
  // console.log(concert['event-day'] + ' ' + concert['start-time']);
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
  if(concert['end-time'] < concert['start-time']) concert['end-time'] += 1440;
  // console.log(concert['event-day'] + ' ' + concert['start-time']);
});

var weights = new Object();

function giveweights() {
	for(var i in concerts){
		weights[i['artist-id']] = 1;
	}
}

function distance(a, b) {
	if(a['venue'] == b['venue']) return 0;
	else return 1;
}

function x(time, where) {

}

function findOptimalSchedule() {
	concerts.sort(function(a, b) {
		return a['start-time'] - b['start-time'];
	});
}

findOptimalSchedule();

// Script that was used to merge concert data with concert times.
// It's no longer useful, and only here for reference.

var fs = require("fs");

var concerts = JSON.parse(String(fs.readFileSync("data/concerts.json")));
var venues = {};

function giveweights() {
  var weights = new Object();
  for(var i in concerts){
    weights[concerts[i]['artist-id']] = 1;
  }
  return weights;
}

function distance(a, b) {
  // return time in minutes to travel between a and b
  if(a == b) return 0;
  else return 1;
}

function bestWeightAtTimeAndPlace(time, where) {
  // return maximum weightsum that can be obtained by concerts finishing before time
  var ret = 0;
  var now = -1;
  for(var v in venues){
    var lastendtime = time - distance(where, v);
    var i;
    for(i = venues[v].length - 1; i >= 0 && venues[v][i]['end'] > lastendtime; i--){};
    if(i < 0) continue;
    if(ret < venues[v][i]['w']){
      ret = venues[v][i]['w'];
      now = venues[v][i]['now'];
    }
  }
  return Array(ret, now);
}

function findOptimalSchedule(weights) {
  concerts.forEach(function(concert) {
    venues[concert['venue']] = [];
  });
  concerts.sort(function(a, b) {
    return a['start-time'] - b['start-time'];
  });

  for(var now in concerts){
    var where = concerts[now]['venue'];
    var y = bestWeightAtTimeAndPlace(concerts[now]['start-time'], where);
    var p = {
      'begin': concerts[now]['start-time'],
      'end': concerts[now]['end-time'],
      'w': y[0] + weights[concerts[now]['artist-id']],
      'now': now
    }
    venues[where].push(p);
    concerts[now]['before'] = y[1];
  }
  var maxw = 0, now = -1;
  for(var v in venues){
    if(maxw < venues[v][venues[v].length - 1]['w']){
      maxw = venues[v][venues[v].length - 1]['w'];
      now = venues[v][venues[v].length - 1]['now'];
    }
  }
  if(now == -1) throw new Error("wat");

  var schedule = [];
  do{
    // console.log(concerts[now]['start-time'] + '  ' + concerts[now]['artist-id']);
    schedule.push(concerts[now]['artist-id']);
    now = concerts[now]['before'];
  } while(now !== -1);

  schedule.reverse();
  return schedule;
}
findOptimalSchedule(giveweights());

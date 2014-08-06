var fs = require("fs");
var times = require("../server/source/times");
var distance = require("../server/source/distance");
var weights = require("../server/source/weights");
var activities = require("../server/source/activities");
var timesincestart = (Date.now() - new Date(2014, 7, 7).valueOf())/60000;

var concerts = JSON.parse(String(fs.readFileSync("../server/data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("../server/data/venues.json")));

var mode = "walking";
var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, mode, 1), concerts, weights.weightsForPopularity(concerts, 5, 1), timesincestart);
console.log(JSON.stringify(activities.scheduleToActivities(concerts, venues, mode, 1, schedule), null, 2));

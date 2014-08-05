var fs = require("fs");
var times = require("../server/source/times");
var distance = require("../server/source/distance");
var weights = require("../server/source/weights");
var activities = require("../server/source/activities");

var concerts = JSON.parse(String(fs.readFileSync("server/data/concerts.json")));
var venues = JSON.parse(String(fs.readFileSync("server/data/venues.json")));

var mode = "walking";
var schedule = times.findOptimalSchedule(distance.makeDistanceFunction(venues, mode, 1), concerts, weights.weightsForPopularity(concerts, 5, 1));
console.log(JSON.stringify(activities.scheduleToActivities(concerts, venues, mode, schedule), null, 2));

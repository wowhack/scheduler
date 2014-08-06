// Utility functions for converting the output from the scheduler
// into a UI-friendly list of things to do.

function adjustedEventDay(startTime) {
  return Math.floor(startTime / 60 / 24 - 0.25) + 1;
}

function adjustedEventTime(startTime) {
  var timeOfDay = startTime % (60 * 24);
  if (timeOfDay < 6*60) timeOfDay += 1440;
  return timeOfDay;
}

var dayNames = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var methodVerbs = {
  "walking": "Walk",
  "driving": "Drive",
  "bicycling": "Cycle"
};

function formatMinutesSinceMidnight(minutes) {
  var h = Math.floor(minutes / 60) % 24;
  var m = (minutes % 60);
  var H = (h < 10 ? '0' : '') + h;
  var M = (m < 10 ? '0' : '') + m;
  return H + ':' + M;
}

function scheduleToActivities(concerts, venues, mode, durationMultiplier, schedule) {
  var artists = {};
  concerts.forEach(function(concert) {
    artists[concert['artist-id']] = concert;
  });

  function eventStartTime(artistId) {
    return artists[artistId]['start-time'];
  }

  // Activities is an array of UI-readable concert descriptors
  var activities = schedule.map(function(artistId) {
    var artist = artists[artistId];

    return {
      type: 'concert',
      artistName: artist['artist-name'],
      artistId: artist['artist-id'],
      venueName: venues[artist['venue']].name,
      venueId: artist['venue'],
      startingTime: formatMinutesSinceMidnight(adjustedEventTime(artist['start-time'])),
      duration: artist['end-time'] - artist['start-time']
    };
  });


  // daysWithoutTransits is an array of UI-readable day descriptors (which contain concert descriptors)
  var daysWithoutTransits = activities.reduce(function(previousValue, activity) {
    var lastEventDay = previousValue.length == 0 ? -100 : adjustedEventDay(eventStartTime(previousValue[previousValue.length - 1].activities[0].artistId));
    var currentEventDay = adjustedEventDay(eventStartTime(activity.artistId));
    if (lastEventDay != currentEventDay) {
      return previousValue.concat({
        name: dayNames[currentEventDay],
        day: currentEventDay,
        activities: [activity]
      });
    } else {
      previousValue[previousValue.length - 1].activities.push(activity);
      return previousValue;
    }
  }, []);


  // days is like daysWithoutTransits but with transit activities added
  var days = daysWithoutTransits.map(function(day) {
    day.activities = day.activities.reduce(function(previousValue, activity) {
      var lastVenueId = previousValue.length == 0 ? null : previousValue[previousValue.length - 1].venueId;
      var currentVenueId = activity.venueId;

      var thingsToAdd = [];

      if (lastVenueId !== null && lastVenueId != currentVenueId) {
        var lastVenue = venues[lastVenueId];
        var currentVenue = venues[currentVenueId];

        thingsToAdd.push({
          type: 'transit',
          methodVerb: methodVerbs[mode],
          fromVenueId: lastVenueId,
          fromVenueName: lastVenue.name,
          toVenueId: currentVenueId,
          toVenueName: currentVenue.name,
          shortTransit: lastVenue['festival-area'] && currentVenue['festival-area'],
          duration: venues[lastVenueId].distances[mode][currentVenueId].duration * durationMultiplier,
          distance: venues[lastVenueId].distances[mode][currentVenueId].distance
        });
      }

      thingsToAdd.push(activity);

      return previousValue.concat(thingsToAdd);
    }, []);
    return day;
  });

  return days;
};

exports.scheduleToActivities = scheduleToActivities;
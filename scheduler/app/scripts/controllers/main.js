'use strict';

/**
 * @ngdoc function
 * @name schedulerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the schedulerApp
 */
angular.module('schedulerApp')
  .controller('MainCtrl', function ($http, $window, $scope, $routeParams) {
    $scope.transportationMethod = 'walking';
    $scope.timeOptimist = 500;
    $scope.artistSize = 500;
    $scope.artists = [];

    $scope.days = [
      {
        name: 'torsdag',
        activities: [
          {
            type: 'concert',
            artistName: 'Yung Lean & Sad Boys',
            venueName: 'Dungen',
            startingTime: '18:00',
            duration: '30m'
          },
          {
            type: 'transit',
            methodVerb: 'Walk',
            fromVenueName: 'Dungen',
            toVenueName: 'Azalea',
            duration: '18m'
          },
          {
            type: 'concert',
            artistName: 'The National',
            venueName: 'Azalea',
            startingTime: '20:00',
            duration: '1h 15m'
          }
        ]
      }
    ];

    $scope.preferredConcerts = [
      {
        "venue": "azalea",
        "artist-id": "the-horrors",
        "event-day": 0,
        "artist-name": "The Horrors",
        "spotify-uris": [
          "spotify:artist:7EFB09NxZrMi9pGlOnuBpd"
        ],
        "start-time": 930,
        "end-time": 990,
        "artist-popularity": 44
      },
      {
        "venue": "azalea",
        "artist-id": "tinariwen",
        "event-day": 0,
        "artist-name": "Tinariwen",
        "spotify-uris": [
          "spotify:artist:2sf2owtFSCvz2MLfxmNdkb"
        ],
        "start-time": 1050,
        "end-time": 1120,
        "artist-popularity": 42
      }
    ];
    $scope.removePreferredConcert = function(artistId) {
      $scope.preferredConcerts = $scope.preferredConcerts.filter(function(concert) {
        return concert['artist-id'] != artistId;
      });
    }

    $scope.loginToSpotify = function() {
      var redirect = encodeURIComponent($window.location.href) + '{?}';
      $window.location.href = 'http://localhost:8888/login?redirect=' + redirect;
    };

    $scope.fetchArtists = function(access_token) {
      var artists_url = 'http://localhost:8888/artists?token=' + access_token;
      $http({ method: 'GET', url: artists_url })
          .success(function(data, status, headers, config) {
            $scope.artists = data;
          })
          .error(function(data, status, headers, config) {
            console.log('ERROR', data, status, headers, config);
          });
    }

    var access_token = $routeParams.access_token;
    if (access_token) {
      $scope.fetchArtists(access_token);
    }
  });

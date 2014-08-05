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

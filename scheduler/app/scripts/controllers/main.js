'use strict';

/**
 * @ngdoc function
 * @name schedulerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the schedulerApp
 */
angular.module('schedulerApp')
  .controller('MainCtrl', function ($http, $window, $scope, $routeParams, $resource) {
    $scope.transportationMethod = 'walking';
    $scope.timeOptimist = 500;
    $scope.artistSize = 500;
    $scope.artists = [];

    $scope.activities = $resource('http://localhost:8888/activities').get();

    $scope.preferredConcerts = [
      {
        'venue': 'azalea',
        'artist-id': 'the-horrors',
        'event-day': 0,
        'artist-name': 'The Horrors',
        'spotify-uris': [
          'spotify:artist:7EFB09NxZrMi9pGlOnuBpd'
        ],
        'start-time': 930,
        'end-time': 990,
        'artist-popularity': 44
      },
      {
        'venue': 'azalea',
        'artist-id': 'tinariwen',
        'event-day': 0,
        'artist-name': 'Tinariwen',
        'spotify-uris': [
          'spotify:artist:2sf2owtFSCvz2MLfxmNdkb'
        ],
        'start-time': 1050,
        'end-time': 1120,
        'artist-popularity': 42
      }
    ];
    $scope.removePreferredConcert = function(artistId) {
      $scope.preferredConcerts = $scope.preferredConcerts.filter(function(concert) {
        return concert['artist-id'] !== artistId;
      });
    };

    $scope.loginToSpotify = function() {
      var redirect = encodeURIComponent($window.location.href) + '{?}';
      $window.location.href = 'http://localhost:8888/login?redirect=' + redirect;
    };

    $scope.fetchArtists = function(accessToken) {
      var artistsUrl = 'http://localhost:8888/artists?token=' + accessToken;
      $http({ method: 'GET', url: artistsUrl })
          .success(function(data) {
            $scope.artists = data;
          })
          .error(function(data, status, headers, config) {
            console.log('ERROR', data, status, headers, config);
          });
    };

    var accessToken = $routeParams.accessToken;
    if (accessToken) {
      $scope.fetchArtists(accessToken);
    }
  });

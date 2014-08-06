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
    $scope.artistSize = 500;
    $scope.artists = [];

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


    var requestSequenceNumber = 0;
    function updateActivities() {
      var expectedRequestSequenceNumber = ++requestSequenceNumber;

      setTimeout(function() {
        if (expectedRequestSequenceNumber !== requestSequenceNumber) {
          // Update has been called since we started the timeout. In order
          // to avoid bombing the server with requests, cancel this one and
          // let the next update handle it.
          return;
        }

        var url = 'http://localhost:8888/activities?mode='+$scope.transportationMethod+'&popularity='+($scope.artistSize/1000);
        $http({ method: 'GET', url: url })
            .success(function(data) {
              if (expectedRequestSequenceNumber !== requestSequenceNumber) {
                return;
              }

              $scope.activities = data;
            })
            .error(function(data, status, headers, config) {
              console.log('ERROR', data, status, headers, config);
            });
      }, 500);
    }

    updateActivities();
    ['artistSize', 'transportationMethod', 'preferredConcerts'].forEach(function(name) {
      $scope.$watch(name, updateActivities);
    });

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

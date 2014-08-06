'use strict';

/**
 * @ngdoc function
 * @name schedulerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the schedulerApp
 */
angular.module('schedulerApp')
  .controller('MainCtrl', function ($http, $window, $scope, $routeParams, $resource, $cookies, $modal) {
    $scope.transportationMethod = $cookies.transportationMethod || 'walking';
    $scope.artistSize = $cookies.artistSize || 500;
    $scope.artists = [];
    $scope.loading = true;

    $scope.preferredConcerts = [];

    var allConcerts = $resource('http://localhost:8888/concerts').get({}, function() {
      if (!$cookies.preferredConcerts) return;

      $scope.preferredConcerts = $cookies.preferredConcerts.split(/,/).map(function(artistId) {
        var concert = null;
        allConcerts.concerts.forEach(function(innerConcert) {
          if (innerConcert['artist-id'] == artistId) {
            concert = innerConcert;
          }
        });
        return concert;
      });
    });

    $scope.removePreferredConcert = function(artistId) {
      $scope.preferredConcerts = $scope.preferredConcerts.filter(function(concert) {
        return concert['artist-id'] !== artistId;
      });
    };
    $scope.openPreferredConcertAdder = function() {
      var modalInstance = $modal.open({
        templateUrl: 'preferredConcertsAdder.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          concerts: function() {
            return allConcerts.concerts.filter(function(concert) {
              var found = false;
              $scope.preferredConcerts.forEach(function(innerConcert) {
                if (concert['artist-id'] === innerConcert['artist-id']) {
                  found = true;
                }
              });
              return !found;
            });
          }
        }
      });

      modalInstance.result.then(function(selectedConcert) {
        $scope.preferredConcerts.push(selectedConcert);
      }, function () {
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

        var preferredConcertsJoined = $scope.preferredConcerts.map(function(concert) { return concert['artist-id']; }).join(',');

        $cookies.transportationMethod = $scope.transportationMethod;
        $cookies.artistSize = $scope.artistSize;
        $cookies.preferredConcerts = preferredConcertsJoined;

        var url = 'http://localhost:8888/activities'+
            '?mode='+$scope.transportationMethod+
            '&popularity='+($scope.artistSize)+
            '&preferred='+preferredConcertsJoined;

        var accessToken = $routeParams['access_token'];
        if (accessToken) {
          url += '&accessToken='+accessToken;
        }

        $scope.loading = true;
        $http({ method: 'GET', url: url })
            .success(function(data) {
              if (expectedRequestSequenceNumber !== requestSequenceNumber) {
                return;
              }

              $scope.loading = false;
              $scope.activities = data;
            })
            .error(function(data, status, headers, config) {
              console.log('ERROR', data, status, headers, config);
            });
      }, 500);
    }

    updateActivities();
    ['artistSize', 'transportationMethod', 'preferredConcerts.length'].forEach(function(name) {
      $scope.$watch(name, updateActivities);
    });

    $scope.loginToSpotify = function() {
      var redirect = encodeURIComponent($window.location.href) + '{?}';
      $window.location.href = 'http://localhost:8888/login?redirect=' + redirect;
    };
  })
  .controller('ModalInstanceCtrl', function($scope, $modalInstance, concerts) {
    $scope.concerts = concerts;

    $scope.select = function(concert) {
      $modalInstance.close(concert);
    };

    $scope.dismiss = function () {
      $modalInstance.dismiss('dismiss');
    };
  });

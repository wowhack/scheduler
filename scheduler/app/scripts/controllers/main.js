'use strict';

/**
 * @ngdoc function
 * @name schedulerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the schedulerApp
 */
angular.module('schedulerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.transportationMethod = 'walking';
    $scope.timeOptimist = 500;
    $scope.artistSize = 500;

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
  });

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
  });

'use strict';

/**
 * @ngdoc function
 * @name schedulerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the schedulerApp
 */
angular.module('schedulerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

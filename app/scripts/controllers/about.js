'use strict';

/**
 * @ngdoc function
 * @name pickerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pickerApp
 */
angular.module('pickerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

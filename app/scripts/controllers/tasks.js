'use strict';

/**
 * @ngdoc function
 * @name pickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pickerApp
 */
angular.module('pickerApp')
  .controller('mainCtrl', function ($scope, storage) {
   
    storage.bind($scope, 'tasks', {defaultValue : []});
    
    // $scope.tasks = [
      // {'body':'do this 1', 'done':false},
      // {'body':'do this 2', 'done':false},
      // {'body':'do this 3', 'done':true},
      // {'body':'do this 4', 'done':false},
    // ];
    
    $scope.addNew = function() {
      $scope.tasks.push({'body':$scope.newTaskBody, 'done':false});
      $scope.newTaskBody = '';
    };
    $scope.deleteDone = function() {
      var oldTasks = $scope.tasks;
      $scope.tasks = [];
      angular.forEach(oldTasks, function(task) {
        if (!task.done) $scope.tasks.push(task);
      });
    };

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

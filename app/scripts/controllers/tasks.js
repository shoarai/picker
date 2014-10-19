'use strict';

/**
 * @ngdoc function
 * @name pickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pickerApp
 */
angular.module('pickerApp')
  .controller('TaskCtrl', function ($scope, storage) {
   
    storage.bind($scope, 'tasks', {defaultValue : [], storeName: 'tasks'});
    
    // $scope.tasks = [
      // {'body':'do this 1', 'done':false},
      // {'body':'do this 2', 'done':false},
      // {'body':'do this 3', 'done':true},
      // {'body':'do this 4', 'done':false},
    // ];
    
    function getSorted(arr, sortArr) {
      var result = [],
          i = 0;
      for(; i < arr.length; i++) {
        result[i] = arr[sortArr[i]];
      }
      return result;
    }
    
    var mySort = document.getElementById("tasks");
    new Sortable(mySort, {
      onUpdate: function(evt) {
        // get new sort order based on indexes
        var newSortIndexes = [],
            liElements = mySort.getElementsByTagName("li"),
            i = 0;
        for (; i < liElements.length; i++) {
          newSortIndexes.push(liElements[i].getAttribute('data-index'));
        }
        
        // process change
        $scope.newSortIndexes = newSortIndexes;
        $scope.tasks = getSorted($scope.tasks, newSortIndexes);
        $scope.$apply();
      }
    });
    
    
    $scope.addNew = function() {
      $scope.tasks.push({
        'body': $scope.newTaskBody,
        'done': false
      });
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

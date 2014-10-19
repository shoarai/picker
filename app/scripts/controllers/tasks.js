'use strict';

/**
 * @ngdoc function
 * @name pickerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pickerApp
 */
angular.module('pickerApp')
  // View task in HTML form
  .filter('noHTML', function() {
    return function(text) {
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/, '&amp;');
    };
  })
  .filter('newlines', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br>'));
    };
  })
  .controller('TaskCtrl', function ($scope, storage) {    
    /**
     * Task sortable object
     * http://rubaxa.github.io/Sortable/
     */
    var TaskSortable = {
      mySort: document.getElementById('tasks'),
      sortable: {},
      beSortable: function() {
        var mySort = TaskSortable.mySort;
        TaskSortable.mySort.classList.add('sortable');
        TaskSortable.sortable = new Sortable(mySort, {
          handle: '.task-header',
          // animation: 1000,
          onUpdate: function(evt) {
            // get new sort order based on indexes
            var newSortIndexes = [],
                liElements = mySort.getElementsByTagName('li'),
                i = 0;
            for (; i < liElements.length; i++) {
              newSortIndexes.push(liElements[i].getAttribute('data-index'));
            }
            
            // process change
            $scope.newSortIndexes = newSortIndexes;
            $scope.tasks = TaskSortable._getSorted($scope.tasks, newSortIndexes);
            $scope.$apply();
            
            // console.log(localStorage);
          }
        });
      },
      beNotSortable: function() {
        if (!TaskSortable.sortable.destroy) return;
        TaskSortable.sortable.destroy();
        TaskSortable.mySort.classList.remove('sortable');
      },
      _getSorted: function(arr, sortArr) {
        var result = [],
            i = 0;
        for(; i < arr.length; i++) {
          result[i] = arr[sortArr[i]];
        }
        return result;
      }
    };
    TaskSortable.beSortable();
    
    
    // Sync the variable and the localStorage
    storage.bind($scope, 'tasks', {defaultValue: [], storeName: 'tasks'});
    
    // for debug: init task
    // $scope.tasks = [
      // {'body':'do this 1', 'done':false},
      // {'body':'do this 2', 'done':false},
      // {'body':'do this 3', 'done':true},
      // {'body':'do this 4', 'done':false},
    // ];
    
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

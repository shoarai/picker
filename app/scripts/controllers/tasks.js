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
  // http://qiita.com/izumin5210/items/1b9fe7d2f851ba95136b
  .filter('noHTML', function() {
    return function(text) {
      return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/, '&amp;');
    };
  })
  // Transform newlines of task to <br>
  .filter('newlines', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br>'));
    };
  })
  
  /**
   * Focus when showed
   * http://stackoverflow.com/questions/22776662/catch-ng-show-event-and-focus-input-field 
   */
  .directive('focusOnVisibility', function () {
    return function (scope, element, attrs) {
      scope.$watch('editable', function () {
        if (scope.editable === true) {
          element.focus();
        }
      });
    };
  })
  
  
  .directive('moveTask', function () {
    return {
      restrict: 'A',
      link    : function(scope, element, attrs) {
        var startLeft = 0;
        var maxLeft = 90;
        var minLeft = -90;
        
        element.on('touchstart', function(element) {
          startLeft = element.originalEvent.changedTouches[0].clientX;
        });
        element.on('touchmove', function(element) {
          var left = startLeft - element.originalEvent.changedTouches[0].clientX;
          left *= 1.2;
          if (maxLeft < left) {
            left = maxLeft;
          } else if (minLeft > left) {
            left = minLeft;
          }
          element.currentTarget.style.marginLeft = left+'px';
        });
        element.on('touchend', function(element) {
          var left = element.currentTarget.style.marginLeft;
          log(scope.task);
          if (left === maxLeft+'px') {
            if (scope.task.done) {
              // todo: remove
            } else {
              scope.task.done = true;
              scope.$apply();
            }
          } else if (left === minLeft+'px') {
            if (scope.task.done) {
              scope.task.done = false;
              scope.$apply();
            } else {
              // todo: remove
            }
          }
          element.currentTarget.style.marginLeft = 0+'px';
        });
      }
    };
  })
  
  .controller('TaskCtrl', ['$scope', 'storage', function($scope, storage) {
    $scope.testValue = 'double click me!';
    
    var taskElements = document.getElementsByClassName('task');
    var i = 0;
    for (; i < taskElements.length; i++) {
      console.log(element);
      taskElements[i].onclick = function() {
        alert('test');
      };
    };
    
    
    /**
     * Task sortable object
     * https://github.com/RubaXa/Sortable
     */
    var TaskSortable = {
      sortable: {},
      beSortable: function() {
        var mySort = document.getElementById('tasks');
        TaskSortable.sortable = new Sortable(mySort, {
          handle: '.task-header',
          ghostClass: "sortable-ghost",
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
          }
        });
      },
      beNotSortable: function() {
        if (!TaskSortable.sortable.destroy) return;
        TaskSortable.sortable.destroy();
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
    // TaskSortable.beSortable();
    
    
    // Sync the variable and the localStorage
    storage.bind($scope, 'tasks', {defaultValue: [], storeName: 'tasks'});
    
    // for debug: init task
    // $scope.tasks = [
      // {'body':'do this 1', 'done':false},
      // {'body':'do this 2', 'done':false},
      // {'body':'do this 3', 'done':true},
      // {'body':'do this 4', 'done':false},
    // ];
    
    
    //  for debug: Add new tasks
    $scope.testAdd = function() {
      var testTask = 'あいうえおあいうえおあいうえおあいうえおあいうえおあいうえお',
          num = 5,
          i = 0;
      for (; i < num; i++) {
        $scope.tasks.push({
          'body': i+testTask,
          'done': false
        });
      };
    };
    
    // Add new task
    $scope.addNew = function() {
      if (!$scope.newTaskBody) return;  
      $scope.tasks.push({
        'body': $scope.newTaskBody,
        'done': false
      });
      $scope.newTaskBody = '';
    };
        
    // Delete a task
    $scope.remove = function(index) {
      $scope.tasks.splice(index, 1);
    };
    
    // Delete fixed tasks
    $scope.deleteDone = function() {
      var oldTasks = $scope.tasks;
      $scope.tasks = [];
      angular.forEach(oldTasks, function(task) {
        if (!task.done) $scope.tasks.push(task);
      });
    };
    
    // Fix clicked task
    $scope.onclickTask = function(index) {
      $scope.tasks[index].done = !$scope.tasks[index].done;
    };
    
    $scope.onSwipeRight = function(index) {
      console.log(index);
      alert('onSwipeRight');
    };
    
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
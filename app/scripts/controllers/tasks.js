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
  
  // http://dev.classmethod.jp/etc/angularjscmeditabletext/
  .directive('cmEditableText', function() {
    return {
      restrict: 'A',
      require : '^ngModel',
      link    : function(scope, element, attrs, ngModel) {
        ngModel.$render = function() {
          element.html(ngModel.$viewValue);
        };
        
        element.on('hmTap', function() {
        // element.on('dblclick', function() {
          var clickTarget = angular.element(this);
          var EDITING_PROP = 'editing';
          
          if ( !clickTarget.hasClass(EDITING_PROP) ) {
            clickTarget.addClass(EDITING_PROP);
            clickTarget.html('<textarea id="ta">' + ngModel.$viewValue + '</textarea>');
            
            
            // Adjust height of textarea by input
            // http://qiita.com/YoshiyukiKato/items/507b8022e6df5e996a59
/*            var ta = document.getElementById("input-task");
            ta.style.lineHeight = "20px";
            ta.style.height = "30px";
            ta.addEventListener("input",function(evt){
                if(evt.target.scrollHeight > evt.target.offsetHeight){   
                    evt.target.style.height = evt.target.scrollHeight + "px";
                }else{
                    var height,lineHeight;
                    while (true){
                        height = Number(evt.target.style.height.split("px")[0]);
                        lineHeight = Number(evt.target.style.lineHeight.split("px")[0]);
                        evt.target.style.height = height - lineHeight + "px"; 
                        if(evt.target.scrollHeight > evt.target.offsetHeight){
                            evt.target.style.height = evt.target.scrollHeight + "px";
                            break;
                        }
                    }
                }
            });*/
            
            
            
            var inputElement = clickTarget.children();
            
            inputElement.on('focus', function() {
              inputElement.on('blur', function() {
                var inputValue = inputElement.val() || this.defaultValue;
                clickTarget.removeClass(EDITING_PROP).text(inputValue);
                inputElement.off();
                scope.$apply(function() {
                  ngModel.$setViewValue(inputValue);
                });
              });
            });
            inputElement[0].focus();
          }
        });

        var destroyWatcher = scope.$on('$destroy', function() {
          if ( angular.equals(destroyWatcher, null) ) {
            return;
          }
          element.off();
          destroyWatcher();
          destroyWatcher = null;
        });
      }
    };
  })
  .controller('TaskCtrl', ['$scope', 'storage', function($scope, storage) {
    $scope.testValue = 'double click me!';
    
    // return;
    
    
    var taskElements = document.getElementsByClassName('task');
    console.log(taskElements);
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
            
            // console.log(localStorage);
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
    TaskSortable.beSortable();
    
    $scope.dragControlListeners = {
      accept: function(sourceItemHandleScope, destSortableScope) {
        return true;
      },
      itemMoved: function(event) {
        console.log('event');
        // event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
      },
      orderChanged: function(event) {
        console.log('event');
      },
      containment: '#board'//optional param.
    };
    
    
    
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
      
      // var ele =  document.getElementById('finish');
      // ele.disabled = 'true';
      
      // Check disable of finishing button
/*      var element = document.getElementById('finish');
      element.disabled = true;
      angular.forEach($scope.tasks, function(task) {
        if (task.done) {
          element.disabled = false;
          return;
        }
      });*/
    };
    
    $scope.onDoubleTap = function() {
      alert('onDoubleTap');
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
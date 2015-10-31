require([ "./vatuta/vatuta.js", "resurrect" ], function(vatuta, resurrect) {
	var vatutaApp = angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages','ngSanitize',
			'vatuta' ]);

	vatutaApp.controller('projectCtrl', [
			'$scope',
			'$mdSidenav',
			'Project',
			'Task',
			'Engine',
			'Canvas',
			'Restrictions',
			'$mdDialog',
			'$mdBottomSheet',
			'$mdToast',
			'ProjectSerializer',
			function($scope, $mdSidenav, Project, Task, Engine, Canvas,
					Restrictions, $mdDialog, $mdBottomSheet, $mdToast, ProjectSerializer) {
				$scope.toggleSidenav = function(menuId) {
					$mdSidenav(menuId).toggle();
				};

				var project = new Project({
					_name : "Example Project"
				});
				Engine.currentProject(project);
				
				var taskA = new Task({
					_name : "A",
					_duration : 3
				});
				project.addTask(taskA);
				
				var taskB = new Task({
					_name : "B",
					_duration : 5
				});
				project.addTask(taskB);
				
				var taskC = new Task({
					_name : "C",
					_duration : 7
				});
				project.addTask(taskC);
				
				var taskD = new Task({
					_name : "D",
					_duration : 2
				});
				project.addTask(taskD);
				
				new Restrictions.EndToStart({
					_endingTask : taskA,
					_startingTask : taskB
				});
				new Restrictions.EndToStart({
					_endingTask : taskA,
					_startingTask : taskC
				});
				new Restrictions.EndToStart({
					_endingTask : taskB,
					_startingTask : taskD
				});
				new Restrictions.EndToStart({
					_endingTask : taskC,
					_startingTask : taskD
				});

				$scope.project = project;
				$scope.canvasOptions = {
					_dayWidth : 30,
					_rulerHeight : 35,
					_dayFontSize : 15,
					_dayFont : "Roboto, sans-serif",
					_taskFontSize : 15,
					_taskFont : "Roboto, sans-serif",
					_taskTopHeight : 5,
					_taskBottomHeight : 5,
					_taskHeight : 25
				};
				
				if(typeof(Storage) !== "undefined" && localStorage.getItem("project")) {
					$scope.project = ProjectSerializer.deserializeProject(localStorage.getItem("project"));
					Engine.currentProject($scope.project);
				}
				
				
				Engine.calculateEarlyStartLateEnding();
				console.log("fin");

				$scope.ganttListener = {
					onClickOnTask : function(event, task) {
						$scope.$apply(function() {
							$scope.selectedTask = task;
							$mdBottomSheet.show({
							      templateUrl: 'vatuta/templates/bottomSheetMenu.html',
							      controller: 'bottomSheetMenuCtrl',
							      clickOutsideToClose: true,
							      escapeToClose: true,
							      scope: $scope.$new(false, $scope)
							    }).then(function(message, show) {
							    	if (show)
							        $mdToast.show(
							                $mdToast.simple()
							                  .content(message)
							                  .position('top right')
							                  .hideDelay(1500)
							              );
							        });
						});
					}
				};

				$scope.selectedTask = project.getTasks()[0];
				

				function taskChanged(newP, oldP, $scope) {
					console.log('changed');
					Engine.calculateEarlyStartLateEnding();
					$scope.$root.$broadcast('changeTask', $scope.selectedTask);
				}
				
				function taskHash(task) {
					return task.duration() + task.name() + task.description() + restrictionsHash(task.restrictions());
				}
				
				function restrictionsHash(restrictions) {
					return restrictions.map();
				}
				
				function watchSelectedTask() {
					return taskHash($scope.selectedTask);
				}
				
				//$scope.$watch(watchSelectedTask, taskChanged, true);
				$scope.$watch($scope.selectedTask, taskChanged, true);
			} ]);
	
	vatutaApp.controller('bottomSheetMenuCtrl', ['$scope', '$mdBottomSheet', 'Task', 'Engine', function($scope, $mdBottomSheet, Task, Engine) {
		$scope.addTask = function() {
			var newTask = new Task({_duration:1});
			$scope.project.addTask(newTask);
			Engine.calculateEarlyStartLateEnding();
			$scope.selectedTask = newTask;
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide('New task added', true);
			$scope.$root.$broadcast('addTask', newTask);
		}
		$scope.showTask = function() {
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide('Showing task info', false);
		}
	}]);
	
	vatutaApp.controller('menuBarCtrl', ['$scope', '$mdDialog', '$mdToast' , 'Task', 'Project', 'ProjectSerializer', 'Engine', function($scope, $mdDialog, $mdToast, Task, Project, ProjectSerializer, Engine) {
		$scope.fileOpen = function(event) {
			if(typeof(Storage) !== "undefined") {
				$scope.project = ProjectSerializer.deserializeProject(localStorage.getItem("project"));
				Engine.currentProject($scope.project);
				
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project loaded from your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
		};
		$scope.fileSave = function(event) {
			if(typeof(Storage) !== "undefined") {
				var project = ProjectSerializer.serializeProject($scope.$parent.project);
				
				// Store
				localStorage.setItem("project", project);
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project saved on your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
			
		};
	}]);

	vatutaApp.controller('taskEditorCtrl', ['$scope', '$mdDialog', 'Restrictions', function($scope,  $mdDialog, Restrictions) {
		$scope.showTaskDependency = function(ev) {
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'vatuta/templates/TaskDependencyDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      scope: $scope.$new(false, $scope)
		    })
		    .then(function(restriction) {
		    	console.log(restriction.task.index() + restriction.type + ' created for task ' + $scope.selectedTask.index() + '.- ' + $scope.selectedTask.name());
		    	new Restrictions.EndToStart({
					_endingTask : restriction.task,
					_startingTask : $scope.selectedTask
				});
		    }, function() {
		    	console.log('You cancelled the TaskDependency dialog.');
		    });
		 };
		 

		 this.querySearch = function(query) {
			var results = query ? $scope.project.getTasks().filter(filter(query)) : $scope.project.getTasks();
			return results;
		 }
	
		 function filter(query){
		      var lowercaseQuery = angular.lowercase(query);
		      return function filterFn(task) {
		        return (task.index() === parseInt(query) || angular.lowercase(task.name()).indexOf(lowercaseQuery) !== -1);
		      };
		 }
	}]);
	
	angular.bootstrap(document, [ 'vatutaApp' ]);
	
	function DialogController($scope, $mdDialog) {
		  $scope.hide = function() {
		    $mdDialog.hide();
		  };
		  $scope.cancel = function() {
		    $mdDialog.cancel();
		  };
		  $scope.answer = function(type, task) {
		    $mdDialog.hide({type: type, task: task});
		  };
		}
});
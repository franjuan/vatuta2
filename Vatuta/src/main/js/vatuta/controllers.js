require([ "./vatuta/vatuta.js", "resurrect" ], function(vatuta, resurrect) {
	var vatutaApp = angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages',
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
			function($scope, $mdSidenav, Project, Task, Engine, Canvas,
					Restrictions, $mdDialog, $mdBottomSheet, $mdToast) {
				$scope.toggleSidenav = function(menuId) {
					$mdSidenav(menuId).toggle();
				};

				var taskA = new Task({
					_name : "A",
					_duration : 3
				});
				var taskB = new Task({
					_name : "B",
					_duration : 5
				});
				var taskC = new Task({
					_name : "C",
					_duration : 7
				});
				var taskD = new Task({
					_name : "D",
					_duration : 2
				});
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
				var project = new Project({
					_name : "Example Project"
				});
				project.addTask(taskA);
				project.addTask(taskB);
				project.addTask(taskC);
				project.addTask(taskD);
				Engine.calculateEarlyStartLateEnding(project);
				console.log("fin");

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

				$scope.ganttListener = {
					onClickOnTask : function(event, task) {
						$scope.$apply(function() {
							$scope.selectedTask = task;
							$mdBottomSheet.show({
							      templateUrl: 'vatuta/bottomSheetMenu.html',
							      controller: 'bottomSheetMenuCtrl',
							      clickOutsideToClose: true,
							      escapeToClose: true,
							      scope: $scope,
							      preserveScope: true
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
			} ]);
	
	vatutaApp.controller('bottomSheetMenuCtrl', ['$scope', '$mdBottomSheet', 'Task', function($scope, $mdBottomSheet, Task) {
		$scope.addTask = function() {
			var newTask = new Task();
			$scope.project.addTask(newTask);
			$scope.selectedTask = newTask;
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide('New task added', true);
		}
		$scope.showTask = function() {
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide('Showing task info', false);
		}
	}]);
	
	vatutaApp.controller('menuBarCtrl', ['$scope', 'Task', function($scope, Task) {
		$scope.fileOpen = function(event) {
			
		}
		$scope.fileSave = function(event) {
			var namespace = {};
			namespace.Task = Task;
			namespace.Task.name = "Task";
			var necromancer = new Resurrect({
			    resolver: new Resurrect.NamespaceResolver(namespace)
			});
			var task = new Task({
				_name : "C",
				_duration : 7
			});
			task.__proto__.constructor.name = "Task";
			var json = necromancer.stringify(task);
		}
	}]);

	angular.bootstrap(document, [ 'vatutaApp' ]);
});
require([ "./vatuta/vatuta.js" ], function(vatuta) {
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
			function($scope, $mdSidenav, Project, Task, Engine, Canvas,
					Restrictions, $mdDialog) {
				$scope.toggleSidenav = function(menuId) {
					$mdSidenav(menuId).toggle();
				};

				var taskA = new Task({
					_id : "taskA",
					_name : "A",
					_duration : 3
				});
				var taskB = new Task({
					_id : "taskB",
					_name : "B",
					_duration : 5
				});
				var taskC = new Task({
					_id : "taskC",
					_name : "C",
					_duration : 7
				});
				var taskD = new Task({
					_id : "taskD",
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
					onSelectedTaskChange : function(task) {
						$scope.$apply(function() {
							$scope.selectedTask = task;
							$scope.toggleSidenav('left');
						});
					}
				};

				$scope.selectedTask = project.getTasks()[0];

				this.addTask = function(ev) {
					var newTask = new Task();
					project.addTask(newTask);
					newTask.id(newTask.index());
					$scope.selectedTask = newTask;
					$scope.toggleSidenav('left');
				};
			} ]);

	angular.bootstrap(document, [ 'vatutaApp' ]);
});
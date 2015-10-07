require([ "./vatuta/vatuta.js"], function(
		vatuta) {
	var vatutaApp = angular.module('vatutaApp', [ 'ngMaterial', 'vatuta' ]);

	vatutaApp.controller('projectCtrl', [ '$scope', '$mdSidenav', 'Project', 'Task', 'Engine', 'Canvas', 'Restrictions',
			function($scope, $mdSidenav, Project, Task, Engine, Canvas, Restrictions) {

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
						_canvasId : 'gantt',
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

				

			} ]);
	angular.bootstrap(document, [ 'vatutaApp' ]);
});
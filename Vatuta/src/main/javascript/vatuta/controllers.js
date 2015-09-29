var vatutaApp = angular.module('vatutaApp', []);

vatutaApp.controller('projectCtrl', function ($scope) {
  require([ "./vatuta/project.js", "./vatuta/task.js",
			"./vatuta/engine.js", "./vatuta/restriction.js", "./vatuta/canvas.js" ], function(
			Project, Task, Engine, Restriction, Canvas) {
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
		new Vatuta.EndToStartDependency({
			_endingTask : taskA,
			_startingTask : taskB
		});
		new Vatuta.EndToStartDependency({
			_endingTask : taskA,
			_startingTask : taskC
		});
		new Vatuta.EndToStartDependency({
			_endingTask : taskB,
			_startingTask : taskD
		});
		new Vatuta.EndToStartDependency({
			_endingTask : taskC,
			_startingTask : taskD
		});
		var project = new Project({});
		project.addTask(taskA);
		project.addTask(taskB);
		project.addTask(taskC);
		project.addTask(taskD);
		Engine.calculateEarlyStartLateEnding(project);
		console.log("fin");
		
		$scope.$apply(function () {
			$scope.project = project;
		});
		
		var canvas = new Canvas({
			_canvasId : 'gantt',
			_dayWidth : 30,
			_rulerHeight : 30,
			_dayFontSize : 15,
			_dayFont : "Arial",
			_taskFontSize : 15,
			_taskFont : "Arial",
			_taskTopHeight: 5,
			_taskBottomHeight: 5,
			_taskHeight: 25
		});
		canvas.drawTimeRuler(project);
		canvas.drawProject(project);
	});

  console.log(!$scope.project);
});
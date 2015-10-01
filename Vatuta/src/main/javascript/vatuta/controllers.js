var vatutaApp = angular.module('vatutaApp', ['ui.grid', 'ngMaterial']);

vatutaApp.controller('projectCtrl',  ['$scope', '$mdSidenav', function($scope, $mdSidenav){
	$scope.tasksGridOptions = {
		    enableSorting: false,
		    rowHeight: 35,
		    columnDefs: [{
		      name: "Name",
		      field: "getName()"
		    }, {
		      name: "Duration",
		      field: "getDuration()"
		    }]
		  };
	$scope.toggleSidenav = function(menuId) {
	    $mdSidenav(menuId).toggle();
	  };
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
		var project = new Project({_name:"Example Project"});
		project.addTask(taskA);
		project.addTask(taskB);
		project.addTask(taskC);
		project.addTask(taskD);
		Engine.calculateEarlyStartLateEnding(project);
		console.log("fin");
		
		$scope.$apply(function () {
			$scope.project = project;
			$scope.tasksGridOptions.data = project.getTasks();
		});
		
		var canvas = new Canvas({
			_canvasId : 'gantt',
			_dayWidth : 30,
			_rulerHeight : 35,
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
  
  
  this.project=$scope.project;
  console.log(!$scope.project);
}]);
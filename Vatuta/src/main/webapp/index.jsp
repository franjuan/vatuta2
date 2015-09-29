<!DOCTYPE html>
<html ng-app>
<head>
<meta charset="UTF-8">
<title>Vatuta</title>
<link rel="stylesheet" type="text/css" href="gantt.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"
	data-dojo-config="async: true,
					  packages : [
					  	{name : 'underscorejs',	location : 'http://underscorejs.org', main: 'underscore-min'},
					  	{name : 'lodash', location: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1', main: 'lodash.min'},
					  	{name : 'easeljs', location: 'https://code.createjs.com', main: 'easeljs-0.8.1.min'}
					  ], 
					  baseUrl : '/vatuta/'"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
</head>

<body>
	<div>Nothing here {{'yet' + '!'}}</div>
	<canvas id="gantt"></canvas>
	<script>
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
			project = new Project({});
			project.addTask(taskA);
			project.addTask(taskB);
			project.addTask(taskC);
			project.addTask(taskD);
			Engine.calculateEarlyStartLateEnding(project);
			console.log("fin");
			
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
	</script>
</body>
</html>

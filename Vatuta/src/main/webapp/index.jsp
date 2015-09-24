<!DOCTYPE html>
<html>
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
					  baseUrl : '/'"></script>
</head>

<body>
	<canvas id="gantt"></canvas>
	<script>
		require([ "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js", "./vatuta/restriction.js" ],
				function(Project, Task, Engine, Restriction) {
					var taskA = new Task({_id:"taskA", _duration: 3});
					var taskB = new Task({_id:"taskB", _duration: 5});
					var taskC = new Task({_id:"taskC", _duration: 7});
					var taskD = new Task({_id:"taskD", _duration: 2});
					new Vatuta.EndToStartDependency({_endingTask: taskA, _startingTask: taskB});
					new Vatuta.EndToStartDependency({_endingTask: taskA, _startingTask: taskC});
					new Vatuta.EndToStartDependency({_endingTask: taskB, _startingTask: taskD});
					new Vatuta.EndToStartDependency({_endingTask: taskC, _startingTask: taskD});
					project = new Project({});
					project.addTask(taskA);
					project.addTask(taskB);
					project.addTask(taskC);
					project.addTask(taskD);
					Engine.calculateEarlyStartLateEnding(project);
					console.log("fin");
				});
	</script>
	<script>
		require(['easeljs'],
				function(){
					var stage = new createjs.Stage("gantt");
					
					var task = new createjs.Shape();
					var rect = task.graphics.beginFill("DeepSkyBlue").drawRect(0, 0, 200, 50);
					task.x = 100;
					task.y = 100;
					stage.addChild(task);

					stage.enableMouseOver();
					stage.update();
				}
		);
	</script>
</body>
</html>

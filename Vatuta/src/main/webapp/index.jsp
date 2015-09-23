<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Vatuta</title>
<script
	src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"
	data-dojo-config="async: true,
					  packages : [
					  	{name : 'underscorejs',	location : 'http://underscorejs.org', main: 'underscore-min'},
					  	{name : 'lodash', location: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1', main: 'lodash.min'}
					  ], 
					  baseUrl : '/'"></script>
</head>

<body>
	<h2>Hello World!</h2>
	<h1 id="greeting">Hello</h1>
	<script>
		require([ "dojo/dom", "dojo/dom-construct", "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js", "./vatuta/restriction.js" ],
				function(dom, domConstruct, Project, Task, Engine, Restriction) {
					//var greetingNode = dom.byId('greeting');
					//var pr = new Project();
					//console.log(pr);
					//domConstruct.place(pr.getHello(), greetingNode);
					var taskA = new Task({_id:"taskA", _duration: 3});
					var taskB = new Task({_id:"taskB", _duration: 5});
					var taskC = new Task({_id:"taskC", _duration: 7});
					var taskD = new Task({_id:"taskD", _duration: 2});
					new Vatuta.EndToStartDependency({_endingTask: taskA, _startingTask: taskB});
					new Vatuta.EndToStartDependency({_endingTask: taskA, _startingTask: taskC});
					new Vatuta.EndToStartDependency({_endingTask: taskB, _startingTask: taskD});
					new Vatuta.EndToStartDependency({_endingTask: taskC, _startingTask: taskD});
					var project = new Project({});
					project.addTask(taskA);
					project.addTask(taskB);
					project.addTask(taskC);
					project.addTask(taskD);
					Engine.calculateEarlyStartLateEnding(project);
					Console.log("fin");
				});
	</script>
</body>
</html>

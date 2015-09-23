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
					var task1 = new Task({_id:"task1", _duration: 3});
					var task2 = new Task({_id:"task2", _duration: 6});
					var restriction = new Vatuta.EndToStartDependency({_endingTask: task1, _startingTask: task2});
					task1.getDependencies();
					task1.getDependants();
					task2.getDependencies();
					task2.getDependants();
					var project = new Project({});
					project.addTask(task2);
					project.addTask(task1);
					Engine.calculateEarlyStartLateEnding(project);
				});
	</script>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Vatuta</title>
<script
	src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"
	data-dojo-config="async: true,
					  packages : [
					  	{name : 'underscorejs',	location : 'http://underscorejs.org', main: 'underscore-min'}
					  ], 
					  baseUrl : '/'"></script>
</head>

<body>
	<h2>Hello World!</h2>
	<h1 id="greeting">Hello</h1>
	<script>
		require([ "dojo/dom", "dojo/dom-construct", "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js" ],
				function(dom, domConstruct, Project, Task, Engine) {
					var greetingNode = dom.byId('greeting');
					var pr = new Project();
					console.log(pr);
					domConstruct.place(pr.getHello(), greetingNode);
					var task1 = new Task({_duration: 3});
					var task2 = new Task({_duration: 6});
				});
	</script>
</body>
</html>

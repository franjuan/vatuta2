<!DOCTYPE html>
<html ng-app="vatutaApp">
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
<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
<link rel="stylesheet"
	href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.4/angular-material.min.css">
<script src="vatuta/controllers.js"></script>
</head>

<body ng-controller="projectCtrl">
	<div id="tableContainer">
		<ul>
			<li ng-repeat="task in project.getTasks()"><span>{{task.getName()}}</span>
				<p>{{task.getDuration()}}</p></li>
		</ul>
	</div>
	<div id="ganttContainer">
		<canvas id="gantt"></canvas>
	</div>
</body>
</html>

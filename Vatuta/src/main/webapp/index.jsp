<!DOCTYPE html>
<html ng-app="vatutaApp">
<head>
<meta charset="UTF-8">
<title>Vatuta</title>
<link rel="stylesheet" type="text/css" href="vatuta.css">
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

<link rel="styleSheet" href="js/ui-grid.css"/>
<script src="js/ui-grid.js"></script>
	
<script src="vatuta/controllers.js"></script>
</head>

<body ng-controller="projectCtrl">
	<div id="tableContainer">
		<div id="tasksGrid" ui-grid="tasksGridOptions" ></div>
	</div>
	<div id="ganttContainer">
		<canvas id="gantt"></canvas>
	</div>
</body>
</html>

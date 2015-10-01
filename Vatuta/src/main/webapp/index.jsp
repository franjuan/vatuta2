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
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.js"></script>
<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-animate.js"></script>
<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-aria.js"></script>
<link rel="stylesheet"
	href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.1/angular-material.min.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.1/angular-material.js"></script>
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">

<link rel="styleSheet" href="js/ui-grid.css" />
<script src="js/ui-grid.js"></script>

<script src="vatuta/controllers.js"></script>
</head>

<body ng-controller="projectCtrl" layout="column" ng-cloak>
	<md-toolbar layout="row">
	<div class="md-toolbar-tools">
		<md-button ng-click="toggleSidenav('left')"
			class="md-icon-button"> <md-icon aria-label="Menu"
			md-svg-icon="icons/ic_view_list_white_48px.svg"></md-icon>
		</md-button>
		<h1>Vatuta</h1>
	</div>
	</md-toolbar>
	<div layout="row" flex>
		<md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2"
			md-component-id="left">
			<!-- <div id="tasksGrid" ui-grid="tasksGridOptions"></div> -->
			<md-list-item class="md-1-line" ng-repeat="task in project.getTasks()">
        <div class="md-list-item-text" layout="row">
        	<md-input-container flex>
        		<label>Id</label>
          		<input ng-model="task._id">
        	</md-input-container>
        	<md-input-container flex>
        		<label>Name</label>
          		<input ng-model="task._name">
        	</md-input-container>
        	<md-input-container flex>
        		<label>Duration</label>
          		<input ng-model="task._duration">
        	</md-input-container>
        </div>
      </md-list-item>
		</md-sidenav>
		<div layout="column" flex id="content">
			<md-content layout="column" flex class="">
				<canvas id="gantt"></canvas>
			</md-content>
		</div>
	</div>
</body>
</html>

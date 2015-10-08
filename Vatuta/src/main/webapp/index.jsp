<!DOCTYPE html>
<html>
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
<script
	src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular-messages.js"></script>
<link rel="stylesheet"
	href="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.1/angular-material.min.css">
<script
	src="https://ajax.googleapis.com/ajax/libs/angular_material/0.11.1/angular-material.js"></script>
<link rel="stylesheet"
	href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">

<script src="vatuta/controllers.js"></script>

</head>

<body ng-controller="projectCtrl" layout="column" ng-cloak>
	<md-toolbar class="md-menu-toolbar" layout="row"
		layout-align="space-between"> <md-toolbar-filler layout
		layout-align="center center"> <md-button
		ng-click="toggleSidenav('left')" class="md-icon-button"> <md-icon
		aria-label="Menu" md-svg-icon="icons/ic_view_list_white_48px.svg"></md-icon>
	</md-button> </md-toolbar-filler>
	<div flex>
		<h2 class="md-toolbar-tools">
			<md-input-container flex> <label>Project
				name</label> <input ng-model="project.name"
				ng-model-options="{ getterSetter: true }"></input> </md-input-container>
		</h2>
		<md-menu-bar> <md-menu>
		<button ng-click="$mdOpenMenu()">File</button>
		<md-menu-content> <md-menu-item> <md-button
			ng-click="ctrl.sampleAction('open', $event)"> Open... </md-button> </md-menu-item> <md-menu-divider></md-menu-divider>
		<md-menu-item> <md-button
			ng-click="ctrl.sampleAction('savee', $event)"> Save... </md-button> </md-menu-item>
		</md-menu-content> </md-menu> </md-menu-bar>
	</div>
	<md-toolbar-filler layout layout-align="center center">
	<md-button class="md-icon-button"> <md-icon
		aria-label="Notifications"
		md-svg-icon="icons/ic_announcement_white_48px.svg"
		style="color: greenyellow;"></md-icon> </md-button> </md-toolbar-filler> <md-toolbar-filler layout
		layout-align="center center"> <md-button
		class="md-icon-button"> <md-icon aria-label="My account"
		md-svg-icon="icons/ic_account_box_white_48px.svg"></md-icon> </md-button> </md-toolbar-filler> </md-toolbar>
	<div layout="row" flex>
		<md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2"
			md-component-id="left"> <!-- <div id="tasksGrid" ui-grid="tasksGridOptions"></div> -->
		<div layout="column">
			<form name="taskForm">
				<md-input-container flex>
					<label>Task id</label>
					<input name="id" ng-model="project.getTasks()[0].id" ng-model-options="{ getterSetter: true }" unique-id> </input>
					<div ng-messages="taskForm.id.$error" role="alert">
			          <div ng-message="required">Task must have an unique Id</div>
			          <div ng-message="uniqueId">A task with this Id already exists</div>
			        </div>
				</md-input-container>
				<md-input-container flex>
					<label>Name</label>
					<input name="name" ng-model="project.getTasks()[0].name" ng-model-options="{ getterSetter: true }" required></input>
					<div ng-messages="taskForm.name.$error" role="alert">
			          <div ng-message="required">Task must have a name</div>
			        </div>
				</md-input-container>
				<md-input-container flex>
					<label>Duration</label>
					<input name="duration" ng-model="project.getTasks()[0].duration" ng-model-options="{ getterSetter: true }" required></input>
					<div ng-messages="taskForm.duration.$error" role="alert">
			          <div ng-message="required">Task must have a duration</div>
			        </div>
				</md-input-container>
				<div layout="row" layout-align="space-between center">
					<md-button class="md-raised md-primary">Cancel</md-button>
					<md-button class="md-raised md-primary">Accept</md-button>
				</div>
			</form>
		</div>
		</md-sidenav>
		<div layout="column" flex id="content">
			<md-content layout="column" flex class=""> <vatuta-gantt
				project-data='project' canvas-id='gantt'
				canvas-options='canvasOptions'></vatuta-gantt> <!-- <canvas id="gantt"></canvas> -->
			</md-content>
		</div>
	</div>
</body>
</html>

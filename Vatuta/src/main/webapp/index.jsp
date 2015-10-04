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
	<md-toolbar class="md-menu-toolbar" layout="row" layout-align="space-between">

		<md-toolbar-filler layout layout-align="center center">
			<md-button ng-click="toggleSidenav('left')" class="md-icon-button">
				<md-icon aria-label="Menu" md-svg-icon="icons/ic_view_list_white_48px.svg"></md-icon>
			</md-button>
		</md-toolbar-filler>
		<div flex>
			<h2 class="md-toolbar-tools">
				<md-input-container flex>
					<label>Project name</label>
					<input ng-model="project.name" ng-model-options="{ getterSetter: true }"></input>
				</md-input-container>
			</h2>
			<md-menu-bar>
				<md-menu>
					<button ng-click="$mdOpenMenu()">File</button>
					<md-menu-content>
						<md-menu-item>
							<md-button ng-click="ctrl.sampleAction('open', $event)"> Open... </md-button>
						</md-menu-item>
						<md-menu-divider></md-menu-divider>
						<md-menu-item>
							<md-button ng-click="ctrl.sampleAction('savee', $event)"> Save... </md-button>
						</md-menu-item>
					</md-menu-content>
				</md-menu>
			</md-menu-bar>
		</div>
		<md-toolbar-filler layout layout-align="center center">
	        <md-button class="md-icon-button" >
	          <md-icon aria-label="Notifications" md-svg-icon="icons/ic_announcement_white_48px.svg" style="color: greenyellow;"></md-icon>
	        </md-button>
	    </md-toolbar-filler>
	    <md-toolbar-filler layout layout-align="center center">
	        <md-button class="md-icon-button" >
	          <md-icon aria-label="My account" md-svg-icon="icons/ic_account_box_white_48px.svg"></md-icon>
	        </md-button>
        </md-toolbar-filler>

	</md-toolbar>
	<div layout="row" flex>
		<md-sidenav layout="column" class="md-sidenav-left md-whiteframe-z2"
			md-component-id="left"> <!-- <div id="tasksGrid" ui-grid="tasksGridOptions"></div> -->
		<md-list-item class="md-1-line" ng-repeat="task in project.getTasks()">
		<div class="md-list-item-text" layout="row">
			<md-input-container flex> <label>Id</label> <input
				ng-model="task._id"> </md-input-container>
			<md-input-container flex> <label>Name</label> <input
				ng-model="task._name"> </md-input-container>
			<md-input-container flex> <label>Duration</label>
			<input ng-model="task._duration"> </md-input-container>
		</div>
		</md-list-item> </md-sidenav>
		<div layout="column" flex id="content">
			<md-content layout="column" flex class="">
			<canvas id="gantt"></canvas>
			</md-content>
		</div>
	</div>
</body>
</html>

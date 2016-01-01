define([ "vatuta/services/vatuta",
         "lib/css!https://cdnjs.cloudflare.com/ajax/libs/angular-ui-grid/3.0.7/ui-grid.min.css",
		 "ui-grid" ], function(vatuta) {
	var vatutaApp = angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages',
			'ngSanitize', 'ngCookies', 'ngAnimate', 'ngRoute',
			'ui.grid', 'ui.grid.moveColumns', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.cellNav', 'ui.grid.edit',
			'vatuta' ]);

	vatutaApp.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/gantt', {
			templateUrl : 'vatuta/partials/GanttView.html',
			controller : 'GanttController',
			controllerAs : 'ctrl'
		}).when('/dataTable', {
			templateUrl : 'vatuta/partials/DataTableView.html',
			controller : 'DataTableController',
			controllerAs : 'ctrl'
		}).otherwise({
			redirectTo : '/gantt'
		});
	} ]);

	vatutaApp.constant('config', {
		policyVersion : 0.1,
		version : 0.22
	}).run(function($rootScope, config) {
		$rootScope.$config = config;
	});

	return vatutaApp;
});
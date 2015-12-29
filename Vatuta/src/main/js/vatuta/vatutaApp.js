define([ "vatuta/services/vatuta" ], function(vatuta) {
	var vatutaApp = angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages',
			'ngSanitize', 'ngCookies', 'ngAnimate', 'ngRoute', 'vatuta' ]);

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
		version : 0.21
	}).run(function($rootScope, config) {
		$rootScope.$config = config;
	});

	return vatutaApp;
});
define(
		[ "vatuta/vatutaApp" ],
		function() {
			angular
					.module('vatutaApp')
					.controller(
							'DataTableController',
							[
									'$scope',
									'$mdDialog',
									'$mdToast',
									function($scope, $mdDialog, $mdToast) {
										this.message =  "This is a test message in DataTable view";
									} ]);
		});
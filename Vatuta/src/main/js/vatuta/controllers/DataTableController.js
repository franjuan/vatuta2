define([  "vatuta/vatutaApp"  ],
		function() {
			angular
					.module('vatutaApp')
					.controller(
							'DataTableController',
							[
									'$scope',
									'$mdDialog',
									'$mdToast',
									'$project',
									function($scope, $mdDialog, $mdToast, $project) {
										$scope.message =  "This is a test message in DataTable view";$scope
										$scope.project = $project;
										$project.name("Other name");
										$scope.dataTableOptions = {
											getRowIdentity: function(row) {
												return row.index();
											},
										    enableSorting: true,
										    columnDefs: [
											    { displayName: '#', field: 'index()' },
											    { displayName: 'Name', field: 'name()' },
											    { displayName: 'Duration', field: 'duration().shortFormatter()', enableSorting: false }
										    ],
										    data: $project.tasks(),
										    onRegisterApi: function( gridApi ) {
										    	$scope.dataTableGridApi = gridApi;
										    }
										};
									} ]);
		});
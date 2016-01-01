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
											enableGridMenu: true,
										    enableSorting: true,
										    enableCellEditOnFocus: true,
										    columnDefs: [
											    { displayName: '#', field: 'index()', enableCellEdit: false },
											    { displayName: 'id', field: 'id()', enableCellEdit: false, visible: false },
											    { displayName: 'Name', field: 'name()', editModelField: 'name', editableCellTemplate: 'vatuta/templates/ui-grid/StringEditCell.html' },
											    { displayName: 'Description', field: 'description()', editModelField: 'description', editableCellTemplate: 'vatuta/templates/ui-grid/StringEditCell.html' },
											    { displayName: 'Duration', field: 'duration().shortFormatter()', enableSorting: false, enableCellEdit: false},
											    { displayName: 'Tactic', field: 'tactic()', editableCellTemplate: 'ui-grid/dropdownEditor',
											        editDropdownOptionsArray: [{id: 'ASAP', tactic: 'ASAP'}, {id: 'ALAP', tactic: 'ALAP'}, {id: 'Manual', tactic: 'Manual'}],
											        editDropdownIdLabel: 'id', editDropdownValueLabel: 'tactic', cellTemplate: 'vatuta/templates/ui-grid/TacticCell.html' },
											    { displayName: 'Restrictions', field: 'restrictions()', enableSorting: false, cellTemplate: 'vatuta/templates/ui-grid/RestrictionsCell.html', enableCellEdit: false, enableSorting: false }
										    ],
										    data: $project.tasks(),
										    onRegisterApi: function( gridApi ) {
										    	$scope.dataTableGridApi = gridApi;
										    	
										    	gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
										    		console.log(oldValue);
										    	})
										    }
										};
									} ]);
		});
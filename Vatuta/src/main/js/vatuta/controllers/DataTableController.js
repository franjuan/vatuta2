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
										    enableRowSelection: true,
										    enableSelectAll: true,
										    selectionRowHeaderWidth: 35,
										    columnDefs: [
											    { displayName: '#', field: 'index()', enableCellEdit: false, width: '*' },
											    { displayName: 'Id', field: 'id()', enableCellEdit: false, visible: false, width: '*' },
											    { displayName: 'Name', field: 'name()', editModelField: 'name', editableCellTemplate: 'vatuta/templates/ui-grid/StringEditCell.html', width: '*' },
											    { displayName: 'Description', field: 'description()', editModelField: 'description', editableCellTemplate: 'vatuta/templates/ui-grid/StringEditCell.html', width: '*' },
											    { displayName: 'Planned Duration', field: 'duration().shortFormatter()', enableSorting: false, enableCellEdit: false, width: '*'},
											    { displayName: 'Tactic', field: 'tactic()', enableCellEdit: false, editableCellTemplate: 'ui-grid/dropdownEditor',
											        editDropdownOptionsArray: [{id: 'ASAP', tactic: 'ASAP'}, {id: 'ALAP', tactic: 'ALAP'}, {id: 'Manual', tactic: 'Manual'}],
											        editDropdownIdLabel: 'id', editDropdownValueLabel: 'tactic', cellTemplate: 'vatuta/templates/ui-grid/TacticCell.html', width: '*' },
											    { displayName: 'Restrictions', field: 'restrictions()', cellTemplate: 'vatuta/templates/ui-grid/RestrictionsCell.html', enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Early Start', field: 'earlyStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Early End', field: 'earlyEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late Start', field: 'lateStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late End', field: 'lateEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Actual Start', field: 'actualStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Actual End', field: 'actualEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Actual Duration', field: 'actualDuration().shortFormatter()',  enableCellEdit: false, enableSorting: false, width: '*' }
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
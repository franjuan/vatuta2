define([  "vatuta/shared/Duration", "vatuta/shared/Tactics", "vatuta/vatutaApp"  ],
		function(Duration, Tactics) {
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
										
										this.durationString = function(newDuration) {
										     if (arguments.length) {
										    	 this._durationString = newDuration;
										    	 var duration = Duration.validator(newDuration);
										    	 if (typeof duration == "object")
										    		 this.duration(duration);
										     } else {
										    	 return this._durationString;
										     }
										}
										this.durationSort = function(a, b, rowA, rowB, direction) {
								    		var nulls = $scope.dataTableGridApi.core.sortHandleNulls(a, b);
								            if( nulls !== null ) {
								              return nulls;
								            } else {
								              return Duration.compare(a,b);
								            }
								    	}
										
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
										    treeRowHeaderWidth: 35,
										    showTreeExpandNoChildren: false,
										    columnDefs: [
											    { displayName: '#', field: 'index()', enableCellEdit: false, width: '*' },
											    { displayName: 'Id', field: 'id()', enableCellEdit: false, visible: false, width: '*' },
											    { displayName: 'Name', field: 'name()', editModelField: 'name', cellTemplate: 'vatuta/templates/ui-grid/TreeLevelStringCell.html', editableCellTemplate: 'vatuta/templates/ui-grid/RequiredStringEditCell.html', width: '*' },
											    { displayName: 'Description', field: 'description()', editModelField: 'description', editableCellTemplate: 'vatuta/templates/ui-grid/StringEditCell.html', width: '*' },
											    { displayName: 'Planned Duration', field: 'duration()', cellFilter: 'duration: false: "-"',
											    	sortingAlgorithm: this.durationSort,
											    	cellEditableCondition: function ($scope) {
											    		return !!$scope.row.entity.duration();
											    	},
											    	editableCellTemplate: 'vatuta/templates/ui-grid/DurationEditCell.html', editModelField: 'durationString', width: '*'},
											    { displayName: 'Tactic', field: 'tactic()', cellTemplate: 'vatuta/templates/ui-grid/TacticCell.html',
											        editDropdownOptionsArray: Tactics.getTactics(), editDropdownIdLabel: 'name', editDropdownValueLabel: 'tactic',
											        enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor', width: '*' },
											    { displayName: 'Restrictions', field: 'restrictions()', cellTemplate: 'vatuta/templates/ui-grid/RestrictionsCell.html', enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Early Start', field: 'earlyStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Early End', field: 'earlyEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late Start', field: 'lateStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late End', field: 'lateEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Actual Start', field: 'actualStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Actual End', field: 'actualEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Actual Duration', field: 'actualDuration().shortFormatter()',  enableCellEdit: false,
											    	sortingAlgorithm: this.durationSort, enableSorting: true, width: '*' }
										    ],
										    data: $project.tasks(),
										    onRegisterApi: function( gridApi ) {
										    	$scope.dataTableGridApi = gridApi;
										    	gridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef){
										    		if (colDef.displayName == 'Planned Duration') {
										    			rowEntity.durationString = _.bind(this.grid.appScope.ctrl.durationString, rowEntity);
										    			rowEntity._durationString = rowEntity.duration()?rowEntity.duration().shortFormatter():"";
										    		}
										    	});
										    	gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
										    		if (colDef.displayName == 'Planned Duration') {
										    			delete rowEntity.durationString;
										    			delete rowEntity._durationString;
										    		}
										    	})
										    }
										};
										
									} ]);
		});
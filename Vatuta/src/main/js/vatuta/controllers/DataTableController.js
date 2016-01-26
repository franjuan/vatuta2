define([  "vatuta/shared/Duration", "vatuta/shared/Tactics", "moment", "vatuta/vatutaApp"  ],
		function(Duration, Tactics, moment) {
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
										
										this.durationSort = function(a, b, rowA, rowB, direction) {
								    		var nulls = $scope.dataTableGridApi.core.sortHandleNulls(a, b);
								            if( nulls !== null ) {
								              return nulls;
								            } else {
								              return Duration.compare(a,b);
								            }
								    	}
										
										this.momentSort = function(a, b, rowA, rowB, direction) {
								    		var nulls = $scope.dataTableGridApi.core.sortHandleNulls(a, b);
								            if( nulls !== null ) {
								              return nulls;
								            } else {
								              var da = moment.isMoment(a)?a:moment(a);
								              var db = moment.isMoment(b)?b:moment(b);
								              if (da > db) {
								            	  return 1;
								              } else if (da < db) {
								            	  return -1;
								              } else {
								            	  return 0;
								              }
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
											    	}, enableCellEdit: true,
											    	editableCellTemplate: 'vatuta/templates/ui-grid/DurationEditCell.html', editModelField: 'duration', width: '*'},
//											    { displayName: 'Estimated', field: 'isEstimated()', type:'boolean',
//												    	cellEditableCondition: function ($scope) {
//												    		return !!$scope.row.entity.duration();
//												    	}, enableCellEdit: true,
//												    	editModelField: 'isEstimated', width: '*'},
											    { displayName: 'Tactic', field: 'tactic()', cellTemplate: 'vatuta/templates/ui-grid/TacticCell.html',
											        editDropdownOptionsArray: Tactics.getTactics(), editDropdownIdLabel: 'name', editDropdownValueLabel: 'name',
											        editModelField: 'tactic', enableCellEdit: true, editableCellTemplate: 'vatuta/templates/ui-grid/TacticEditCell.html', width: '*' },
											    { displayName: 'Restrictions', field: 'restrictions()', cellTemplate: 'vatuta/templates/ui-grid/RestrictionsCell.html', enableCellEdit: false, enableSorting: false, width: '*' },
											    { displayName: 'Early Start', field: 'earlyStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Early End', field: 'earlyEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late Start', field: 'lateStart().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Late End', field: 'lateEnd().format("DD-MM-YYYY")',  enableCellEdit: false, enableSorting: false, visible: false, width: '*' },
											    { displayName: 'Actual Start', field: 'actualStart()', cellFilter: 'moment: "DD-MM-YYYY"', type: "date",
											    	enableSorting: true, sortingAlgorithm: this.momentSort,
											    	cellEditableCondition: function ($scope) {
											    		return $scope.row.entity.tactic().name()=="Manual";
											    	}, enableCellEdit: true, editableCellTemplate: 'vatuta/templates/ui-grid/MomentEditCell.html', editModelField: 'manualStart',
											    	width: '*' },
										    	{ displayName: 'Actual End', field: 'actualEnd()', cellFilter: 'moment: "DD-MM-YYYY"', type: "date",
											    	enableSorting: true, sortingAlgorithm: this.momentSort,
											    	cellEditableCondition: function ($scope) {
											    		return $scope.row.entity.tactic().name()=="Manual";
											    	}, enableCellEdit: true, editableCellTemplate: 'vatuta/templates/ui-grid/MomentEditCell.html', editModelField: 'manualEnd',
											    	width: '*' },
											    { displayName: 'Actual Duration', field: 'actualDuration()', cellFilter: 'duration: false: "-"', enableCellEdit: false,
											    	sortingAlgorithm: this.durationSort, enableSorting: true, width: '*' }
										    ],
										    data: $project.tasks(),
										    onRegisterApi: function( gridApi ) {
										    	$scope.dataTableGridApi = gridApi;
										    	gridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef){
										    		
										    	});
										    	gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
										    		
										    	});
										    }
										};
										
									} ]);
		});
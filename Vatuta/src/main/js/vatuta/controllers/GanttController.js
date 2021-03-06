define(
		[ "moment", "vatuta/vatutaApp" ],
		function(moment) {
			angular
					.module('vatutaApp')
					.controller(
							'GanttController',
							[
									'$scope',
									'$mdSidenav',
									'Project',
									'Task',
									'SummaryTask',
									'Engine',
									'Canvas',
									'Restrictions',
									'$mdDialog',
									'$mdBottomSheet',
									'$mdToast',
									'ProjectSerializer',
									'$cookies',
									'config',
									'$animate',
									'$project',
									'VatutaHandler',
									function($scope, $mdSidenav, Project, Task,
											SummaryTask, Engine, Canvas,
											Restrictions, $mdDialog,
											$mdBottomSheet, $mdToast,
											ProjectSerializer, $cookies,
											$config, $animate, $project, VatutaHandler) {

										$scope.toggleSidenav = function(menuId) {
											$mdSidenav(menuId).toggle();
										};
										
										$scope.project = $project;
										
										$scope.canvasOptions = {
											_dayWidth : 30,
											_rulerHeight : 45, // TODO Meter este valor con less en vatuta.css
											_dayFontSize : 15,
											_dayFont : "Roboto, sans-serif",
											_taskFontSize : 15,
											_taskFont : "Roboto, sans-serif",
											_taskTopHeight : 10,
											_taskBottomHeight : 12,
											_taskHeight : 30,
											_arrowHeight : 8,
											_arrowWidth : 5,
											_arrowColor : "#CFD8DC",
											_taskBgColor : "#607D8B",
											_taskNameColor : "White",
											_rulerColor : "#C5CAE9",
											_arrowCornerR : 6,
											_connectorRatio : 5 / 3,
											_sideMargins : 20,
											_earlyLateLimitsColor : "#607D8B"
										};

										if (typeof (Storage) !== "undefined"
												&& localStorage
														.getItem("project")) {
											$scope.project = ProjectSerializer
													.deserializeProject(localStorage
															.getItem("project"));
											Engine
													.currentProject($scope.project);
										}

										Engine.calculateEarlyStartLateEnding();
										console.log("fin");

										$scope.ganttListener = {
											onClickOnTask : function(event,
													task) {
												$scope
														.$apply(function() {
															$scope.selectedTask = task;
															//$scope.toggleSidenav('left');
														});
											},
											onClickOnTaskContainer : function(
													event, task) {
												$scope.$apply(function() {
													$scope.selectedTask = null;
												});
//												$scope
//														.$apply(function() {
//															$scope.selectedTask = task;
//															$mdBottomSheet
//																	.show(
//																			{
//																				templateUrl : 'vatuta/templates/BottomSheetMenu.html',
//																				controller : 'BottomSheetMenuController',
//																				clickOutsideToClose : true,
//																				escapeToClose : true,
//																				scope : $scope
//																						.$new(
//																								false,
//																								$scope)
//																			})
//																	.then(
//																			function(
//																					promise) {
//																				if (promise.show)
//																					$mdToast
//																							.show($mdToast
//																									.simple()
//																									.content(
//																											promise.message)
//																									.position(
//																											'top right')
//																									.hideDelay(
//																											1500));
//																			});
//														});
											}//,
//											onClickTaskOperation: function (event, task, operation) {
//												switch (operation) {
//													case "showTaskInfo":
//														$scope.toggleSidenav('left');
//														break;
//													case "moveUpTask":
//														break;
//													case "moveDownTask":
//														break;
//													case "deleteTask":
//														VatutaHandler.deleteTask(task)
//													 	.then (function(task){},
//													 			function(err){});
//														break;
//													case "addChild":
//														VatutaHandler.addChildTask(task)
//															.then(
//																function(newTask){
//																	$scope.selectedTask = newTask;
//																	$scope.toggleSidenav('left');
//																},
//																function(err){});
//														break;
//													case "addSiblingBefore":
//														VatutaHandler.addSiblingTaskBefore(task)
//														.then(
//															function(newTask){
//																$scope.selectedTask = newTask;
//																$scope.toggleSidenav('left');
//															},
//															function(err){});
//														break;
//													case "addSiblingAfter":
//														VatutaHandler.addSiblingTaskAfter(task)
//														.then(
//															function(newTask){
//																$scope.selectedTask = newTask;
//																$scope.toggleSidenav('left');
//															},
//															function(err){});
//														break;
//												}
//											}
										};

										function taskChanged(newP, oldP, $scope) {
											console.log('changed');
											if (oldP
													&& newP.substring(0, 35) === oldP
															.substring(0, 35)) {
												Engine
														.calculateEarlyStartLateEnding();
												$scope.$root.$broadcast(
														'changeTask',
														$scope.selectedTask);
											} else if (!!$scope.selectedTask) {
												$scope.$root.$broadcast(
														'taskSelected',
														$scope.selectedTask);
											}
										}
										
										$(window).resize(function(){
										    	$scope.$root.$broadcast(
														'windowResize',
														$scope.selectedTask);
										});

										function watchSelectedTask() {
											return !!$scope.selectedTask ? $scope.selectedTask
													.watchHash()
													: undefined;
										}

										$scope.$watch(watchSelectedTask,
												taskChanged, true);

										if (!$cookies.get("policyVersion")
												|| $cookies
														.getObject("policyVersion") < $config.policyVersion) {
											$mdDialog
													.show(
															{
																controller : function(
																		$scope,
																		$mdDialog) {
																	$scope.close = function() {
																		$mdDialog
																				.hide();
																	};
																	$scope.cancel = function() {
																		$mdDialog
																				.cancel();
																	};
																},
																templateUrl : 'vatuta/templates/policyWarning.tmpl.html',
																parent : angular
																		.element(document.body),
																clickOutsideToClose : true,
																escapeToClose : true,
																scope : $scope
																		.$new(
																				false,
																				$scope)
															})
													.then(
															function() {
																var now = new Date();
																now
																		.setFullYear(now
																				.getFullYear() + 1)
																$cookies
																		.putObject(
																				"policyVersion",
																				$config.policyVersion,
																				{
																					expires : now
																				});
															});
										} else if (!$cookies.get("version")
												|| $cookies
														.getObject("version") < $config.version) {
											var newScope = $scope.$new(false,
													$scope);
											newScope.version = $cookies
													.getObject("version");
											$mdDialog
													.show(
															{
																controller : function(
																		$scope,
																		$mdDialog) {
																	$scope.close = function() {
																		$mdDialog
																				.hide();
																	};
																	$scope.cancel = function() {
																		$mdDialog
																				.hide();
																	};
																},
																templateUrl : 'vatuta/templates/VersionInfo.html',
																parent : angular
																		.element(document.body),
																clickOutsideToClose : true,
																escapeToClose : true,
																scope : newScope
															})
													.then(
															function() {
																var now = new Date();
																now
																		.setFullYear(now
																				.getFullYear() + 1)
																$cookies
																		.putObject(
																				"version",
																				$config.version,
																				{
																					expires : now
																				});
															});
										}

									} ]);

		});
define(
		[ "resurrect", "moment", "vatuta/vatutaApp" ],
		function(resurrect, moment) {
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
									function($scope, $mdSidenav, Project, Task,
											SummaryTask, Engine, Canvas,
											Restrictions, $mdDialog,
											$mdBottomSheet, $mdToast,
											ProjectSerializer, $cookies,
											$config, $animate) {

										$scope.toggleSidenav = function(menuId) {
											$mdSidenav(menuId).toggle();
										};

										var project = new Project({
											_name : "Example Project"
										});
										Engine.currentProject(project);

										// Start2End
										var base = new Task({
											_name : "Base",
											_duration : new Duration({
												days : 4
											})
										});
										project.addTask(base);

										var summary = new SummaryTask({
											_name : "Summary"
										});
										project.addTask(summary);

										var taskA = new Task({
											_name : "A",
											_duration : new Duration({
												days : 5
											})
										});
										project.addTask(taskA, summary);

										var taskB = new Task({
											_name : "B",
											_duration : new Duration({
												days : 4
											})
										});
										project.addTask(taskB, summary);

										var taskC = new Task({
											_name : "C",
											_duration : new Duration({
												days : 6
											})
										});
										project.addTask(taskC, summary);

										new Restrictions.StartToStart({
											_dependency : base,
											_dependant : summary
										});

										new Restrictions.EndToStart({
											_dependency : taskA,
											_dependant : taskB
										});

										new Restrictions.StartToEnd({
											_dependency : taskB,
											_dependant : taskC
										});

										// // End2Start
										// var base2 = new Task({
										// _name : "Base",
										// _duration : new Duration({days: 3})
										// });
										// project.addTask(base2);
										//			                                               				
										// var summary2 = new SummaryTask({
										// _name : "Summary"
										// });
										// project.addTask(summary2);
										//			                                               				
										// var taskA2 = new Task({
										// _name : "A",
										// _duration :new Duration({days: 5})
										// });
										// project.addTask(taskA2);
										// summary.addTask(taskA2);
										//			                                               				
										// var taskB2 = new Task({
										// _name : "B",
										// _duration :new Duration({days: 4})
										// });
										// project.addTask(taskB2);
										// summary.addTask(taskB2);
										//			                                               				
										// var taskC2 = new Task({
										// _name : "C",
										// _duration :new Duration({days: 6})
										// });
										// project.addTask(taskC2);
										// summary.addTask(taskC2);
										//			                                               				
										// new Restrictions.EndToEnd({
										// _dependency : base2,
										// _dependant : summary2
										// });
										//			                                               				
										// new Restrictions.EndToStart({
										// _dependency : taskA2,
										// _dependant : taskB2
										// });
										//			                                               				
										// new Restrictions.EndToStart({
										// _dependency : taskB2,
										// _dependant : taskC2
										// });

										// var taskA = new Task({
										// _name : "A",
										// _duration : new Duration({days: 3})
										// });
										// project.addTask(taskA);
										//			                                               				
										// var taskB = new Task({
										// _name : "B",
										// _duration :new Duration({days: 5})
										// });
										// project.addTask(taskB);
										//			                                               				
										// var taskC = new Task({
										// _name : "C",
										// _duration : new Duration({days: 7})
										// });
										// project.addTask(taskC);
										//			                                               				
										// var taskD = new Task({
										// _name : "D",
										// _duration : new Duration({days: 2})
										// });
										// project.addTask(taskD);
										//			                                               				
										// new Restrictions.EndToStart({
										// _dependency : taskA,
										// _dependant : taskB
										// });
										// new Restrictions.EndToStart({
										// _dependency : taskA,
										// _dependant : taskC
										// });
										// new Restrictions.EndToStart({
										// _dependency : taskB,
										// _dependant : taskD
										// });
										// new Restrictions.EndToStart({
										// _dependency : taskC,
										// _dependant : taskD
										// });
										//			                                               				
										// var taskE = new Task({
										// _name : "E",
										// _duration : new Duration({days: 3})
										// });
										// project.addTask(taskE);
										// var taskF = new Task({
										// _name : "F",
										// _duration : new Duration({days: 5})
										// });
										// project.addTask(taskF);
										// new Restrictions.StartToStart({
										// _dependency : taskE,
										// _dependant : taskF
										// });
										// new Restrictions.EndToStart({
										// _dependency : taskB,
										// _dependant : taskE
										// });

										$scope.project = project;
										$scope.canvasOptions = {
											_dayWidth : 30,
											_rulerHeight : 35,
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
															$scope
																	.toggleSidenav('left');
														});
											},
											onClickOnTaskContainer : function(
													event, task) {
												$scope
														.$apply(function() {
															$scope.selectedTask = task;
															$mdBottomSheet
																	.show(
																			{
																				templateUrl : 'vatuta/templates/BottomSheetMenu.html',
																				controller : 'BottomSheetMenuController',
																				clickOutsideToClose : true,
																				escapeToClose : true,
																				scope : $scope
																						.$new(
																								false,
																								$scope)
																			})
																	.then(
																			function(
																					promise) {
																				if (promise.show)
																					$mdToast
																							.show($mdToast
																									.simple()
																									.content(
																											promise.message)
																									.position(
																											'top right')
																									.hideDelay(
																											1500));
																			});
														});
											}
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
											} else {
												$scope.$root.$broadcast(
														'taskSelected',
														$scope.selectedTask);
											}
										}

										function watchSelectedTask() {
											return $scope.selectedTask ? $scope.selectedTask
													.watchHash()
													: "null";
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
																templateUrl : 'vatuta/templates/versionInfo.tmpl.html',
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
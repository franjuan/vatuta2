require([ "vatuta/services", "resurrect", "moment", "vatuta/shared/Duration", "vatuta/controllers/TaskDependencyDialogController"], function(vatuta, resurrect, moment, DurationUtils) {
	

	angular.module('vatutaApp')
			.constant('config', {
				policyVersion: 0.1,
				version: 0.21})
			.run(function ($rootScope, config) {
		        $rootScope.$config = config;
		    });
	
	angular.module('vatutaApp').controller('projectCtrl', [
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
			function($scope, $mdSidenav, Project, Task, SummaryTask, Engine, Canvas,
					Restrictions, $mdDialog, $mdBottomSheet, $mdToast, ProjectSerializer, $cookies, $config) {
				
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
					_duration : new Duration({days: 4})
				});
				project.addTask(base);
				
				var summary = new SummaryTask({
					_name : "Summary"
				});
				project.addTask(summary);
				
				var taskA = new Task({
					_name : "A",
					_duration :new Duration({days: 5})
				});
				project.addTask(taskA, summary);
				
				var taskB = new Task({
					_name : "B",
					_duration :new Duration({days: 4})
				});
				project.addTask(taskB, summary);
				
				var taskC = new Task({
					_name : "C",
					_duration :new Duration({days: 6})
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
				
//				// End2Start
//				var base2 = new Task({
//					_name : "Base",
//					_duration : new Duration({days: 3})
//				});
//				project.addTask(base2);
//				
//				var summary2 = new SummaryTask({
//					_name : "Summary"
//				});
//				project.addTask(summary2);
//				
//				var taskA2 = new Task({
//					_name : "A",
//					_duration :new Duration({days: 5})
//				});
//				project.addTask(taskA2);
//				summary.addTask(taskA2);
//				
//				var taskB2 = new Task({
//					_name : "B",
//					_duration :new Duration({days: 4})
//				});
//				project.addTask(taskB2);
//				summary.addTask(taskB2);
//				
//				var taskC2 = new Task({
//					_name : "C",
//					_duration :new Duration({days: 6})
//				});
//				project.addTask(taskC2);
//				summary.addTask(taskC2);
//				
//				new Restrictions.EndToEnd({
//					_dependency : base2,
//					_dependant : summary2
//				});
//				
//				new Restrictions.EndToStart({
//					_dependency : taskA2,
//					_dependant : taskB2
//				});
//				
//				new Restrictions.EndToStart({
//					_dependency : taskB2,
//					_dependant : taskC2
//				});

					
				
//				var taskA = new Task({
//					_name : "A",
//					_duration : new Duration({days: 3})
//				});
//				project.addTask(taskA);
//				
//				var taskB = new Task({
//					_name : "B",
//					_duration :new Duration({days: 5})
//				});
//				project.addTask(taskB);
//				
//				var taskC = new Task({
//					_name : "C",
//					_duration : new Duration({days: 7})
//				});
//				project.addTask(taskC);
//				
//				var taskD = new Task({
//					_name : "D",
//					_duration : new Duration({days: 2})
//				});
//				project.addTask(taskD);
//				
//				new Restrictions.EndToStart({
//					_dependency : taskA,
//					_dependant : taskB
//				});
//				new Restrictions.EndToStart({
//					_dependency : taskA,
//					_dependant : taskC
//				});
//				new Restrictions.EndToStart({
//					_dependency : taskB,
//					_dependant : taskD
//				});
//				new Restrictions.EndToStart({
//					_dependency : taskC,
//					_dependant : taskD
//				});
//				
//				var taskE = new Task({
//					_name : "E",
//					_duration : new Duration({days: 3})
//				});
//				project.addTask(taskE);
//				var taskF = new Task({
//					_name : "F",
//					_duration : new Duration({days: 5})
//				});
//				project.addTask(taskF);
//				new Restrictions.StartToStart({
//					_dependency : taskE,
//					_dependant : taskF
//				});
//				new Restrictions.EndToStart({
//					_dependency : taskB,
//					_dependant : taskE
//				});

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
					_earlyLateLimitsColor: "#607D8B"
				};
				
				if(typeof(Storage) !== "undefined" && localStorage.getItem("project")) {
					$scope.project = ProjectSerializer.deserializeProject(localStorage.getItem("project"));
					Engine.currentProject($scope.project);
				}
				
				
				Engine.calculateEarlyStartLateEnding();
				console.log("fin");

				$scope.ganttListener = {
					onClickOnTask : function(event, task) {
						$scope.$apply(function() {
							$scope.selectedTask = task;
							$scope.toggleSidenav('left');
						});
					},
					onClickOnTaskContainer : function(event, task) {
						$scope.$apply(function() {
							$scope.selectedTask = task;
							$mdBottomSheet.show({
							      templateUrl: 'vatuta/templates/bottomSheetMenu.html',
							      controller: 'bottomSheetMenuCtrl',
							      clickOutsideToClose: true,
							      escapeToClose: true,
							      scope: $scope.$new(false, $scope)
							    }).then(function(promise) {
							    	if (promise.show)
							        $mdToast.show(
							                $mdToast.simple()
							                  .content(promise.message)
							                  .position('top right')
							                  .hideDelay(1500)
							              );
							        });
						});
					}
				};

				function taskChanged(newP, oldP, $scope) {
					console.log('changed');
					if (oldP && newP.substring(0,35) === oldP.substring(0,35)) {
						Engine.calculateEarlyStartLateEnding();
						$scope.$root.$broadcast('changeTask', $scope.selectedTask);
					} else {
						$scope.$root.$broadcast('taskSelected', $scope.selectedTask);
					}
				}
				
				function watchSelectedTask() {
					return $scope.selectedTask?$scope.selectedTask.watchHash():"null";
				}
				
				$scope.$watch(watchSelectedTask, taskChanged, true);
				
				if (!$cookies.get("policyVersion") || $cookies.getObject("policyVersion") < $config.policyVersion) {
				    $mdDialog.show({
				    	  controller: 	function ($scope, $mdDialog) {
					    		  			$scope.close = function() {
					    		  				$mdDialog.hide();
					    		  			};
					    		  			$scope.cancel = function() {
					    		  				$mdDialog.cancel();
					    		  			};
				    	  				},
					      templateUrl: 'vatuta/templates/policyWarning.tmpl.html',
					      parent: angular.element(document.body),
					      clickOutsideToClose:true,
					      escapeToClose: true,
					      scope: $scope.$new(false, $scope)
				    }).then(
				    	function() {
				    		var now = new Date();
				    		now.setFullYear(now.getFullYear() + 1)
				    		$cookies.putObject("policyVersion", $config.policyVersion, {expires: now});
				        });
				} else if (!$cookies.get("version") || $cookies.getObject("version") < $config.version) {
					var newScope = $scope.$new(false, $scope);
					newScope.version = $cookies.getObject("version");
				    $mdDialog.show({
				    	  controller: 	function ($scope, $mdDialog) {
					    		  			$scope.close = function() {
					    		  				$mdDialog.hide();
					    		  			};
					    		  			$scope.cancel = function() {
					    		  				$mdDialog.hide();
					    		  			};
				    	  				},
					      templateUrl: 'vatuta/templates/versionInfo.tmpl.html',
					      parent: angular.element(document.body),
					      clickOutsideToClose:true,
					      escapeToClose: true,
					      scope: newScope
				    }).then(
					    	function() {
					    		var now = new Date();
					    		now.setFullYear(now.getFullYear() + 1)
					    		$cookies.putObject("version", $config.version, {expires: now});
					        });
				}
			} ]);
	
	angular.module('vatutaApp').controller('bottomSheetMenuCtrl', ['$scope', '$mdBottomSheet', 'Task', 'Engine', 'ProjectHandler', function($scope, $mdBottomSheet, Task, Engine, handler) {
		$scope.addTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project);
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.addSiblingTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project, null, $scope.selectedTask.parent());
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.addChildTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project, null, $scope.selectedTask);
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.showTask = function() {
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'Showing task info', show: false});
		}
	}]);
	
	angular.module('vatutaApp').controller('menuBarCtrl', ['$scope', '$mdDialog', '$mdToast' , 'Task', 'Project', 'ProjectSerializer', 'Engine', function($scope, $mdDialog, $mdToast, Task, Project, ProjectSerializer, Engine) {
		$scope.fileOpen = function(event) {
			if(typeof(Storage) !== "undefined") {
				$scope.project = ProjectSerializer.deserializeProject(localStorage.getItem("project"));
				Engine.currentProject($scope.project);
				
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project loaded from your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
				ga('send', 'event', 'project', 'load');
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
		};
		$scope.fileSave = function(event) {
			if(typeof(Storage) !== "undefined") {
				var project = ProjectSerializer.serializeProject($scope.$parent.project);
				
				// Store
				localStorage.setItem("project", project);
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project saved on your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
				ga('send', 'event', 'project', 'store');
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
			
		};
		$scope.asImage = function($event) {
		      var parentEl = angular.element(document.body);
		       $mdDialog.show({
		         parent: parentEl,
		         targetEvent: $event,
		         templateUrl:  'vatuta/templates/downloadAsImage.html',
		         controller: function DialogController($scope, $mdDialog) {
				        $scope.closeDialog = function() {
				          $mdDialog.hide();
				        }
				        $scope.imageContents = function() {
							return angular.element("canvas#ganttCanvas")[0].toDataURL();
						}
		         }
		      });
		       ga('send', 'event', 'project', 'asImage');
		};
		
		}]);

	angular.module('vatutaApp').controller('taskEditorCtrl', ['$scope', '$mdDialog', '$mdToast', '$mdSidenav','Restrictions', 'Engine', function($scope,  $mdDialog, $mdToast, $mdSidenav, Restrictions, Engine) {
		this.showTaskDependency = function(ev) {
		    $mdDialog.show({
		      controller: 'taskDependencyDialogController',
		      templateUrl: 'vatuta/templates/TaskDependencyDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      scope: $scope.$new(false, $scope)
		    })
		    .then(function(restriction) {
		    	// TODO Si en task no se selecciona una tarea, aunque esté el texto de búsqueda, da error porque restriction.task es null
		    	console.log(restriction.task.index() + restriction.type + ' created for task ' + $scope.selectedTask.index() + '.- ' + $scope.selectedTask.name());
		    	var restriction;
		    	switch (restriction.type) {
		    	  case "FS":
		    		  restriction = new Restrictions.EndToStart({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "FF":
		    		  restriction = new Restrictions.EndToEnd({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "SS":
		    		  restriction = new Restrictions.StartToStart({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "SF":
		    		  restriction = new Restrictions.StartToEnd({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	    
		    	}
				// Then detect circular dependencies
				var dependencies = Engine.detectCircularDependencies();
				if (dependencies.length > 0) {
					var newScope = $scope.$new(false, $scope);
					newScope.tasks = dependencies[0];
					newScope.restriction = restriction;
				    $mdDialog.show({
				    	  controller: 	function ($scope, $mdDialog) {
					    		  			$scope.close = function() {
					    		  				$mdDialog.hide();
					    		  			};
					    		  			$scope.cancel = function() {
					    		  				$mdDialog.hide();
					    		  			};
				    	  				},
					      templateUrl: 'vatuta/templates/circularDependencyFoundWarning.tmpl.html',
					      parent: angular.element(document.body),
					      clickOutsideToClose:true,
					      escapeToClose: true,
					      scope: newScope
				    }).then(
					    	function() {
					    		restriction.remove();
						    	$mdToast.show(
						                $mdToast.simple()
						                  .content(restriction.shortDescription() + " has been removed")
						                  .position('top right')
						                  .hideDelay(1500)
						              );
					        });
				}
		    	ga('send', 'event', 'gantt', 'create', 'restriction');
		    }, function() {
		    	console.log('You cancelled the TaskDependency dialog.');
		    });
		 };
		 
		 this.deleteTask  = function(task, event) {
			 var name = task.name();
			 var confirm = $mdDialog.confirm()
	          .title('Would you like to delete task ' + name + '?')
	          .content('Confirm you want to remove the task ' + task.index() + '.- ' + name)
	          .ariaLabel('Remove ' + name)
	          .targetEvent(event)
	          .ok('Confirm removal')
	          .cancel("Don't do it!");
		    $mdDialog.show(confirm).then(function() {
		    	$mdSidenav('left').toggle();
		    	task.remove();
		    	$scope.project.removeTask(task);
		    	$scope.$root.$broadcast('deleteTask', task);
		    	$mdToast.show(
		                $mdToast.simple()
		                  .content("Task " + name + " has been removed")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
		    	ga('send', 'event', 'gantt', 'delete', 'task');
		    }, function() {
		        console.log('Removal of task ' + name + ' cancelled');
		    });
		 }

		 this.querySearch = function(query) {
			var results = query ? _.filter($scope.project.tasks(),filter(query)) : _.filter($scope.project.tasks(),function(task){return task.id()!==$scope.$parent.selectedTask.id();});
			return results;
		 }
		 
		 this.durationString= function(newDuration) {
			     if (arguments.length) {
			    	 $scope._durationString = newDuration;
			    	 var duration = DurationUtils.validator(newDuration);
			    	 if (typeof duration == "object")
			    		 $scope.selectedTask.duration(duration);
			     } else {
			    	 return $scope._durationString;
			     }
		 }
		 
		 $scope.$watch('selectedTask', function(newP, oldP, $scope){
			 $scope._durationString = newP?(newP.duration()?newP.duration().formatter():newP.actualDuration().humanize()):"";
		 });
	
		 function filter(query){
		      var lowercaseQuery = angular.lowercase(query);
		      return function filterFn(task) {
		        return task.id()!==$scope.$parent.selectedTask.id() && (task.index() === parseInt(query) || angular.lowercase(task.name()).indexOf(lowercaseQuery) !== -1);
		      };
		 }
	}]);
	
	angular.module('vatutaApp').directive('duration', [function() {
		  return {
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		      ctrl.$validators.duration = function(modelValue, viewValue) {
		    	if (ctrl.$isEmpty(modelValue)) {
		            // consider empty models to be valid
		            return true;
		        }
		        return typeof DurationUtils.validator(modelValue) == "object";
		      };
		    }
		  };
		}]);
	
	angular.bootstrap(document, [ 'vatutaApp' ]);
});
define([ "./vatuta/project.js", "./vatuta/task.js","./vatuta/baseTask.js", "./vatuta/engine.js",
		"./vatuta/restriction.js", "./vatuta/canvas.js", "moment", "./vatuta/Duration.js" ], function(Project,
		Task, baseTask, Engine, Restrictions, Canvas, moment, Duration) {

	var vatutaMod = angular.module('vatuta', [])
		.config( ['$compileProvider', function( $compileProvider )
			    {
					// To allow download gantt
			        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|mailto):|data:image\//);
			    }
	]);

	vatutaMod.service('Project', [ function() {
		return Project;
	} ]);
	
	vatutaMod.service('Task', [ function() {
		return Task;
	} ]);
	
	vatutaMod.service('Engine', [ function() {
		return Engine;
	} ]);
	
	vatutaMod.service('Canvas', [ function() {
		return Canvas;
	} ]);
	
	vatutaMod.factory('Restrictions', [ function() {
		return Restrictions;
	} ]);
	
	vatutaMod.factory('ProjectSerializer', [ function() {
		var namespace = {};
		namespace.baseTask = baseTask;
		namespace.Task = Task;
		namespace.Project = Project;
		namespace.EndToStartDependency = Restrictions.EndToStart;
		namespace.StartToEndDependency = Restrictions.StartToEnd;
		namespace.StartToStartDependency = Restrictions.StartToStart;
		namespace.EndToEndDependency = Restrictions.EndToEnd;
		namespace.Restriction = Restriction;
		namespace.TaskDependency = TaskDependency;
		namespace.Duration = Duration;
		
		var serializers = {};
		serializers["Moment"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Moment", object.toISOString());
				},
				deserialize: function(value) {
					return moment(value);
				}
		};
		var necromancer = new Resurrect(
				{
					resolver: new Resurrect.NamespaceResolver(
									namespace,
									function(object, constructor){
										if (constructor === '') {
									    	if (object.__proto__ && object.__proto__.declaredClass) {
									    		return constructor = object.__proto__.declaredClass;
									    	}
									    } else {
									    	return constructor;
									    }
									}
								),
					serializers: serializers,
					cleanup: true
				}
			);
		
		return {
			serializeProject: function(project) {
				return necromancer.stringify(project, function(key, value){
					if (key==='_inherited') {
						return undefined;
					} else if (key.indexOf('_$') === 0){
						return undefined;
					} else {
						return value;
					}
				});
			},
			deserializeProject: function(json) {
				return necromancer.resurrect(json);
			}
		};
	} ]);
	

	
	vatutaMod.directive('vatutaTaskEditor', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      selectedTask: '=selectedTask'
			    },
			    templateUrl: 'vatuta/templates/vatutaTaskEditor.html'
			  };
			});

	vatutaMod.directive('vatutaGantt', function($mdDialog) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      listener: '='
			    },
			    template: '<canvas id="ganttRuler"></canvas><canvas id="ganttCanvas"></canvas>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
			    	$scope.canvas.drawTimeRuler($scope.project);
			    	$scope.canvas.drawProject($scope.project);
			    },
			    controller: function($scope, $attrs) {
			    	var onTaskChange = function(task) {
		                console.log('changeTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawProject($scope.project);
		                $scope.canvas.drawTimeRuler($scope.project);
		            };
		            $scope.$on('deleteTask', onTaskChange);
		            $scope.$on('changeTask', onTaskChange);
		        }
			  };
			});
	
	vatutaMod.directive('restrictionListItem', ['$mdDialog', '$mdToast', function($mdDialog, $mdToast) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      restriction: '='
			    },
			    template: '<div ng-include="getTemplateUrl()"></div>',
			    controllerAs: "ctrl",
			    controller: function($scope) {
			        //function used on the ng-include to resolve the template
			        $scope.getTemplateUrl = function() {
			        	return 'vatuta/templates/' + $scope.restriction.template;
			        }
			        
			        this.edit = function(restriction, event) {
						 
					}
					 
					this.remove = function(restriction, event) {
						 var description = restriction.shortDescription();
						 var confirm = $mdDialog.confirm()
				          .title('Would you like to delete restriction ' + restriction.shortDescription() + '?')
				          .content('Confirm you want to remove the ' + restriction.longDescription())
				          .ariaLabel('Remove {{restriction.shortDescription()}}')
				          .targetEvent(event)
				          .ok('Confirm removal')
				          .cancel("Don't do it!");
					    $mdDialog.show(confirm).then(function() {
					    	restriction.remove();
					    	$mdToast.show(
					                $mdToast.simple()
					                  .content(description + " has been removed")
					                  .position('top right')
					                  .hideDelay(1500)
					              );
					    ga('send', 'event', 'gantt', 'delete', 'restriction');
					    }, function() {
					        console.log('Removal of ' + description + ' cancelled');
					    });
					}
			    }
			  };
			}]);
	
	return vatutaMod;
});
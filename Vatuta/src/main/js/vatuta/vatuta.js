define([ "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js",
		"./vatuta/restriction.js", "./vatuta/canvas.js", "moment" ], function(Project,
		Task, Engine, Restrictions, Canvas, moment) {

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
		namespace.Task = Task;
		namespace.Project = Project;
		namespace.EndToStartDependency = Restrictions.EndToStart;
		namespace.Restriction = Restriction;
		
		var serializers = {};
		serializers["Moment"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Moment", object.toISOString());
				},
				deserialize: function(value) {
					return moment(value);
				}
		};
		serializers["Duration"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Duration", object.toISOString());
				},
				deserialize: function(value) {
					return moment.duration(value);
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
					serializers: serializers
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
			    template: '<canvas id="ganttCanvas"></canvas>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
			    	$scope.canvas.drawTimeRuler($scope.project);
			    	$scope.canvas.drawProject($scope.project);
			    },
			    controller: function($scope, $attrs) {
//		            $scope.$on('addTask', function(task) {
//		                console.log('addTask');
//		                $scope.canvas.clear();
//		                $scope.canvas.drawProject($scope.project);
//		                $scope.canvas.drawTimeRuler($scope.project);
//		            });
		            $scope.$on('changeTask', function(task) {
		                console.log('changeTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawProject($scope.project);
		                $scope.canvas.drawTimeRuler($scope.project);
		            });
		        }
			  };
			});
	
	vatutaMod.directive('restrictionListItem', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      restriction: '='
			    },
			    template: '<div ng-include="getTemplateUrl()"></div>',
			    controller: function($scope) {
			        //function used on the ng-include to resolve the template
			        $scope.getTemplateUrl = function() {
			        	return 'vatuta/templates/' + $scope.restriction.template;
			        }
			    }
			  };
			});
	
	return vatutaMod;
});
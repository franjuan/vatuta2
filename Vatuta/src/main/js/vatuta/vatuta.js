define([ "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js",
		"./vatuta/restriction.js", "./vatuta/canvas.js" ], function(Project,
		Task, Engine, Restrictions, Canvas) {

	var vatutaMod = angular.module('vatuta', []);

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
					propertiesFilter: function(key, value, root) {
						return key !== '_inherited';
					}
				}
			);
		
		return {
			serializeProject: function(project) {
				return necromancer.stringify(project);
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
			    templateUrl: 'vatuta/taskEditor.html'
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
			    template: '<canvas></canvas>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
			    	$scope.canvas.drawTimeRuler($scope.project);
			    	$scope.canvas.drawProject($scope.project);
			    },
			    controller: function($scope, $attrs) {
		            $scope.$on('addTask', function(task) {
		                console.log('addTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawTimeRuler($scope.project);
		                $scope.canvas.drawProject($scope.project);
		            });
		            $scope.$on('changeTask', function(task) {
		                console.log('addTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawTimeRuler($scope.project);
		                $scope.canvas.drawProject($scope.project);
		            });
		        }
			  };
			});
	
	return vatutaMod;
});
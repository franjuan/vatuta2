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
					resolver: new Resurrect.NamespaceResolver(namespace, 'declaredClass'),
					exceptionKeys: ['_inherited']
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

	vatutaMod.directive('vatutaGantt', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      listener: '='
			    },
			    template: '<canvas></canvas>',
			    link: function link(scope, element, attrs) {
			    	var canvas = new Canvas(element, scope.options);
			    	canvas.listener(scope.listener);
					canvas.drawTimeRuler(scope.project);
					canvas.drawProject(scope.project);
			    }
			  };
			});
	
	vatutaMod.directive('uniqueId', function() {
		  return {
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		      ctrl.$validators.uniqueId = function(modelValue, viewValue) {
		        var task = scope.project.findTaskById(viewValue);
		        if (task && task.index()!=scope.selectedTask.index()) {
		        	return false;
		        } else {
		        	return true;
		        }
		      };
		    }
		  };
		});
	
	return vatutaMod;
});
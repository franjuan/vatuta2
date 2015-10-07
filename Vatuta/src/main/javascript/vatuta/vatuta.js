define([ "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js",
		"./vatuta/restriction.js", "./vatuta/canvas.js" ], function(Project,
		Task, Engine, Restriction, Canvas) {

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
		return Restriction;
	} ]);
	
	vatutaMod.directive('vatutaGantt', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      canvasId: '@canvasId'
			    },
			    template: '<canvas id="gantt"></canvas>',
			    link: function link(scope, element, attrs) {
			    	var canvas = new Canvas(scope.options);
					canvas.drawTimeRuler(scope.project);
					canvas.drawProject(scope.project);
			    }
			  };
			});
	
	return vatutaMod;
});
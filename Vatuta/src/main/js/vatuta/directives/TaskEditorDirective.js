define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaTaskEditor', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      selectedTask: '=selectedTask'
			    },
			    templateUrl: 'vatuta/templates/TaskEditorSidenav.html'
			  };
			});
});
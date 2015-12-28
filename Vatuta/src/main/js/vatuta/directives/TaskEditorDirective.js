define(["vatuta/vatutaMod"], function() {
	
	angular.module('vatuta').directive('vatutaTaskEditor', function() {
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
define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaGanttToolbarmenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '=',
			    	selectedTask: '='
			    },
			    templateUrl: 'vatuta/templates/GanttToolBarMenu.html',
			    controller: 'GanttToolBarMenuController',
			    controllerAs: 'ctrl'
			  };
			});
});
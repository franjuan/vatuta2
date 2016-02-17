define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaCalendarToolbarmenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '=',
			    	selectedTask: '='
			    },
			    templateUrl: 'vatuta/templates/CalendarToolBarMenu.html',
			    controller: 'CalendarToolBarMenuController',
			    controllerAs: 'ctrl'
			  };
			});
});
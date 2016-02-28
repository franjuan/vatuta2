define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaCalendarToolbarmenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '=',
			    	selectedTask: '=',
			    	calendar: '='
			    },
			    templateUrl: 'vatuta/templates/CalendarToolBarMenu.html',
			    controller: 'CalendarToolBarMenuController',
			    controllerAs: 'ctrl'
			  };
			});
});
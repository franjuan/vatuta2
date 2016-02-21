define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaTimetableEditor', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	timetables:'=',
			    	selectedIndex: '='
			    },
			    controller: 'TimeTableEditorController',
			    controllerAs: 'ctrl',
			    templateUrl: 'vatuta/templates/TimeTableEditorSidenav.html'
			  };
			});
});
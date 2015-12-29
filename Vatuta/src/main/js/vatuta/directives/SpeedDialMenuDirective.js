define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaMenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '=projectData',
			    },
			    templateUrl: 'vatuta/templates/SpeedDialMenu.html'
			  };
			});
});
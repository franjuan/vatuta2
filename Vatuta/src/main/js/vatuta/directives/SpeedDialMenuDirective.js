define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaMenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    },
			    templateUrl: 'vatuta/templates/SpeedDialMenu.html'
			  };
			});
});
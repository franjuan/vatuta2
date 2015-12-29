define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('viewSelector', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    },
			    controller: 'ViewSelectorController',
			    controllerAs: 'ctrl',
			    templateUrl: 'vatuta/templates/ViewSelectorMenu.html'
			  };
			});
});
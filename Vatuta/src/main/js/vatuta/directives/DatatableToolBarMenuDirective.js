define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaDatatableToolbarmenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '='
			    },
			    templateUrl: 'vatuta/templates/DatatableToolBarMenu.html',
			    controller: 'DatatableToolBarMenuController',
			    controllerAs: 'ctrl'
			  };
			});
});
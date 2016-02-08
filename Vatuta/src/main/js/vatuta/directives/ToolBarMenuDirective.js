define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('vatutaToolbarmenu', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			    	project: '=',
			    	selectedTask: '='
			    },
			    templateUrl: 'vatuta/templates/ToolBarMenu.html',
			    controller: 'ToolBarMenuController',
			    controllerAs: 'ctrl'
			  };
			});
});
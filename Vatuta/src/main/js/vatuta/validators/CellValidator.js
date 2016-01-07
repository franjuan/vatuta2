define(["vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').directive('cellValidator', [function() {
		return {
	        restrict: 'A',
	        scope: false,
	        require: 'ngModel',
	        link: function (scope, element, attrs, ngModel) {

	            element.bind('blur', function(evt) {

	              if (scope.inputForm && !scope.inputForm.$valid) {

	                // Stops the rest of the event handlers from being executed
	                evt.stopImmediatePropagation();
	              }

	            });

	        }
	    };
	}]);
});
define(["vatuta/shared/Duration", "vatuta/vatutaApp"], function(DurationUtils) {
	angular.module('vatutaApp').directive('duration', [function() {
		  return {
			restrict:'A',
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		      ctrl.$validators.duration = function(modelValue, viewValue) {
		    	if (ctrl.$isEmpty(modelValue)) {
		            // consider empty models to be valid
		            return true;
		        }
		        return typeof DurationUtils.validator(modelValue) == "object";
		      };
		    }
		  };
		}]);
});
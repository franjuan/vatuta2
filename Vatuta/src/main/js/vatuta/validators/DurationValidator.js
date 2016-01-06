define(["vatuta/shared/Duration", "lodash", "vatuta/vatutaApp"], function(Duration, _) {
//	angular.module('vatutaApp').directive('duration', [function() {
//		  return {
//			restrict:'A',
//		    require: 'ngModel',
//		    link: function(scope, elm, attrs, ctrl) {
//		      ctrl.$validators.duration = function(modelValue, viewValue) {
//		    	if (ctrl.$isEmpty(modelValue)) {
//		            // consider empty models to be valid
//		            return true;
//		        }
//		        return typeof DurationUtils.validator(modelValue) == "object";
//		      };
//		    }
//		  };
//		}]);
	
	angular.module('vatutaApp').directive('duration', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var value = Duration.validator(viewValue);
				    	  if (value.isInstanceOf && value.isInstanceOf(Duration)) { 
				              ctrl.$setValidity('duration', true);
				              return value;
				          } else {
				              ctrl.$setValidity('duration', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('duration', true);
				    		  return "";
				    	  } else if (modelValue.isInstanceOf && modelValue.isInstanceOf(Duration)) { 
				    		  ctrl.$setValidity('duration', true);
				              return modelValue.shortFormatter();
				          } else {
				              ctrl.$setValidity('duration', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
});

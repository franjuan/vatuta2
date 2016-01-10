define(["moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {
	
	angular.module('vatutaApp').directive('momentString', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var value = _.isString(viewValue)?moment(viewValue, "DD-MM-YYYY"):moment.invalid();
				    	  if (value.isValid()) { 
				              ctrl.$setValidity('momentString', true);
				              return value;
				          } else {
				              ctrl.$setValidity('momentString', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('momentString', true);
				    		  return "";
				    	  } else if (moment.isMoment(modelValue) && modelValue.isValid()) { 
				    		  ctrl.$setValidity('momentString', true);
				              return modelValue.format("DD-MM-YYYY");
				          } else {
				              ctrl.$setValidity('momentString', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
	
	angular.module('vatutaApp').directive('momentDate', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var value = _.isDate(viewValue)?moment(viewValue):moment.invalid();
				    	  if (value.isValid()) { 
				              ctrl.$setValidity('momentDate', true);
				              return value;
				          } else {
				              ctrl.$setValidity('momentDate', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('momentDate', true);
				    		  return null;
				    	  } else if (moment.isMoment(modelValue) && modelValue.isValid()) { 
				    		  ctrl.$setValidity('momentDate', true);
				              return modelValue.toDate();
				          } else {
				              ctrl.$setValidity('moment2date', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
});

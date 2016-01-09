define(["moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {
	
	angular.module('vatutaApp').directive('moment', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var value = _.isString(viewValue)?moment(viewValue, "DD-MM-YYYY"):(moment.isMoment(viewValue)?viewValue:moment.invalid());
				    	  if (value.isValid()) { 
				              ctrl.$setValidity('moment', true);
				              return value;
				          } else {
				              ctrl.$setValidity('moment', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('moment', true);
				    		  return "";
				    	  } else if (moment.isMoment(modelValue) && modelValue.isValid()) { 
				    		  ctrl.$setValidity('moment', true);
				              return modelValue.format("DD-MM-YYYY");
				          } else {
				              ctrl.$setValidity('moment', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
});

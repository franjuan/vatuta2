define(["moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {
	
	angular.module('vatutaApp').directive('timeString', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var values = _.isString(viewValue)?viewValue.split(":"):[];
				    	  if (values.length >= 2 && _.isNumber(parseInt(values[0])) && _.isNumber(parseInt(values[1])) && (values.length == 2 || _.isNumber(parseInt(values[2])))) { 
				              ctrl.$setValidity('timeString', true);
				              var value = {};
				              value.hours = parseInt(values[0]);
				              value.minutes = parseInt(values[1]);
				              if (values.length > 2) {
				            	  value.seconds = parseInt(values[2]);
				              }
				              return value;
				          } else {
				              ctrl.$setValidity('timeString', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('timeString', true);
				    		  return "--:--";
				    	  } else if (_.isNumber(modelValue.hours) && _.isNumber(modelValue.minutes)) { 
				    		  ctrl.$setValidity('timeString', true);
				              return modelValue.hours + ":" +
				              	_.padLeft(modelValue.minutes,2,"0") +
				              	(_.isNumber(modelValue.seconds)?(":"+ _.padLeft(modelValue.seconds,2,"0")):"");
				          } else {
				              ctrl.$setValidity('timeString', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
	
});

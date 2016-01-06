define(["vatuta/shared/Tactics", "lodash", "vatuta/vatutaApp"], function(Tactics, _) {

	
	angular.module('vatutaApp').directive('tactic', [function() {
		  return {
				restrict:'A',
			    require: 'ngModel',
			    link: function(scope, elm, attrs, ctrl) {
				      ctrl.$parsers.unshift(function (viewValue) {
				    	  var tactic = Tactics.getTacticInstanceByName(viewValue);
				    	  if (tactic) { 
				              ctrl.$setValidity('tactic', true);
				              return tactic;
				          } else {
				              ctrl.$setValidity('tactic', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
				      ctrl.$formatters.push(function (modelValue) {
				    	  if (!modelValue) {
				    		  ctrl.$setValidity('tactic', false);
				    		  return "";
				    	  } else if (Tactics.isTactic(modelValue)) { 
				    		  ctrl.$setValidity('tactic', true);
				              return modelValue.name();
				          } else {
				              ctrl.$setValidity('tactic', false);
				              // if invalid, return undefined
				              // (no model update happens)
				              return undefined;
				          };
				      });
			    }
		  };
	}]);
});
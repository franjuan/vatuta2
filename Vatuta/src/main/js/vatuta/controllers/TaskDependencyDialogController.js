define([ "vatuta/shared/Duration", "vatuta/vatutaApp"], function(DurationUtils) {
	angular.module('vatutaApp').controller('TaskDependencyDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
		$scope.hide = function() {
		    $mdDialog.hide();
		  };
		  $scope.cancel = function() {
		    $mdDialog.cancel();
		  };
		  $scope.answer = function(type, task) {
		    $mdDialog.hide({type: type, task: task, delay: $scope.delay});
		  };
		  
		  $scope._delayString="";
		  $scope.delayString= function(newDuration) {
			     if (arguments.length) {
			    	 $scope._delayString = newDuration;
			    	 var duration = DurationUtils.validator(newDuration);
			    	 if (typeof duration == "object")
			    		 $scope.delay = duration;
			     } else {
			    	 return $scope._delayString;
			     }
		 };
	}]);
});
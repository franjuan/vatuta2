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
		  
		  this.querySearch = function(query) {
				var results = query ?
						_.filter($scope.$parent.project.tasks(), filter(query)) :
						_.filter($scope.$parent.project.tasks(), function(task){ return task.id()!==$scope.$parent.selectedTask.id(); } );
				return results;
		  }
		  
		  function filter(query){
		      var lowercaseQuery = angular.lowercase(query);
		      return function filterFn(task) {
		        return 	task.id()!==$scope.$parent.selectedTask.id() &&
		        		(task.index() === parseInt(query) || angular.lowercase(task.name()).indexOf(lowercaseQuery) !== -1);
		  };
		 }
	}]);
});
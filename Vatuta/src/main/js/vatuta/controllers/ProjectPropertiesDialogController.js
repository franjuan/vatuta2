define([ "vatuta/shared/Duration", "vatuta/vatutaApp"], function(DurationUtils) {
	angular.module('vatutaApp').controller('ProjectPropertiesDialogController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
		  $scope.hide = function() {
		    $mdDialog.hide(false);
		  };
		  $scope.cancel = function() {
		    $mdDialog.cancel(false);
		  };
		  $scope.answer = function(changed) {
		    $mdDialog.hide(changed);
		  };
		  
	}]);
});
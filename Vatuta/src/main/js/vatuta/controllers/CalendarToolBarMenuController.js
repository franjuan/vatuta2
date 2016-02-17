define([ "moment", "vatuta/vatutaApp"], function(moment) {
	angular.module('vatutaApp').controller('CalendarToolBarMenuController', ['$scope', function($scope) {

		$scope.year = moment().year();
		
		$scope.previousYear = function() {
			$scope.year--;
			$scope.$root.$broadcast(
					'changeYear',
					$scope.year);
		}
		
		$scope.nextYear = function() {
			$scope.year++;
			$scope.$root.$broadcast(
					'changeYear',
					$scope.year);
		}
		
		}]);
});
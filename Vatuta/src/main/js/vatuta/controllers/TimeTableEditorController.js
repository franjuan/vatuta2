define([ "moment", "vatuta/vatutaApp"], function(moment) {	
	angular.module('vatutaApp').controller('TimeTableEditorController', ['$scope', function($scope) {
		$scope.getWeekDays = function() {
			return moment.weekdaysMin();
		}
	}]);
});
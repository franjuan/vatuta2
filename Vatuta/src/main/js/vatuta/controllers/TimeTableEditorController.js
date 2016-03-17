define([ "moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {	
	angular.module('vatutaApp').controller('TimeTableEditorController', ['$scope', 'CalendarHandler', function($scope, CalendarHandler) {
		$scope.getWeekDays = function() {
			return moment.weekdaysMin();
		}
		
		$scope.clickWeekDay = function($timetable, $slice, $weekday, $event) {
			var value = $slice.sliceSelector[$weekday];
			_.forEach($timetable.slices, function(slice, index) {
				// If clicked week day was disabled
				if (!value) {
					// Disable for the rest of the slices
					slice.sliceSelector[$weekday] = false;
				} else {
					// If it was enabled and clicked
					if (slice.sliceSelector[$weekday]) {
						// Disable the current one
						slice.sliceSelector[$weekday] = false;
						// Enable for the next slice and create a new slice if needed
						if (index >= $timetable.slices.length - 1) {
							$timetable.slices.push(
									{sliceSelector:[false,false,false,false,false,false,false],
										workingTimes:[]});
						}
						$timetable.slices[index+1].sliceSelector[$weekday] = true;
						return false;
					}
				}
			});
			// If clicked week day was disabled, enable for the selected one
			if (!value) {
				$slice.sliceSelector[$weekday]=true;
			}
			// Remove weekday empty slices
			_.forEach($timetable.slices, function(slice, index) {
				if (_.every(slice.sliceSelector, function (weekday) {return !weekday;})) {
					$timetable.slices.splice(index, 1);
					return false;
				}
			});
		}
		
		$scope.removeSlice= function(timetable, slice, workingTime) {
			CalendarHandler.removeWorkingTimeFromSlice($scope.calendar, timetable, slice, workingTime);
		}
		
		$scope.addSlice = function(timetable, slice) {
			CalendarHandler.addWorkingTimeToSlice($scope.calendar, timetable, slice);
		}
		
	}]);
});
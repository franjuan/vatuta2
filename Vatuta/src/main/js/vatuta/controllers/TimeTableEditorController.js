define([ "moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {	
	angular.module('vatutaApp').controller('TimeTableEditorController', ['$scope', 'CalendarHandler', function($scope, CalendarHandler) {
		$scope.getWeekDays = function() {
			return moment.weekdaysMin();
		}
		
		$scope.clickWeekDay = function($timetable, $interval, $weekday, $event) {
			var value = $interval.weekday[$weekday];
			_.forEach($timetable.intervals, function(interval, index) {
				// If clicked week day was disabled
				if (!value) {
					// Disable for the rest of the intervals
					interval.weekday[$weekday] = false;
				} else {
					// If it was enabled and clicked
					if (interval.weekday[$weekday]) {
						// Disable the current one
						interval.weekday[$weekday] = false;
						// Enable for the next interval and create a new interval if needed
						if (index >= $timetable.intervals.length - 1) {
							$timetable.intervals.push(
									{weekday:[false,false,false,false,false,false,false],
										ranges:[]});
						}
						$timetable.intervals[index+1].weekday[$weekday] = true;
						return false;
					}
				}
			});
			// If clicked week day was disabled, enable for the selected one
			if (!value) {
				$interval.weekday[$weekday]=true;
			}
			// Remove weekday empty intervals
			_.forEach($timetable.intervals, function(interval, index) {
				if (_.every(interval.weekday, function (weekday) {return !weekday;})) {
					$timetable.intervals.splice(index, 1);
					return false;
				}
			});
		}
		
		$scope.removeInterval= function(timetable, interval, range) {
			CalendarHandler.removeRangeFromInterval($scope.calendar, timetable, interval, range);
		}
		
		$scope.addInterval = function(timetable, interval) {
			CalendarHandler.addRangeToInterval($scope.calendar, timetable, interval);
		}
		
	}]);
});
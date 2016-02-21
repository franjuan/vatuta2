define([ "moment", "lodash", "vatuta/vatutaApp"], function(moment, _) {	
	angular.module('vatutaApp').controller('TimeTableEditorController', ['$scope', function($scope) {
		$scope.getWeekDays = function() {
			return moment.weekdaysMin();
		}
		
		$scope.clickWeekDay = function($timetable, $interval, $weekday, $event) {
			var value = $interval.weekday[$weekday];
			_.forEach($timetable.intervals, function(interval, index) {
				if (!value) {
					interval.weekday[$weekday] = false;
				} else {
					if (interval.weekday[$weekday]) {
						interval.weekday[$weekday] = false;
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
	}]);
});
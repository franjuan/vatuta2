define([ "moment", "lodash", "vatuta/vatutaMod" ], function(Moment, _) {
// TODO Create specs test file for calendar
	angular.module('vatuta').factory('DurationHandler', ["CalendarHandler", function(Calendar) {
		return {
			// TODO Test cases
			addTo: function(moment, duration, calendar) {
				
			},
			upcomingWorkingTime: function(moment, calendar) {
				// Extracted calendar data for moment
				var current = Calendar.searchNode(moment, calendar);
				var timetable = current.leaf.timetable;
				// When timetable ends
				var endOfTimetable = current.highDate;
				// When timetable starts to repeat
				var endOfPeriod = Moment(moment).add(timetable.period.value, timetable.period.units);
				var cursor = Moment(moment);
				// Repeat for every slice until
				// * End of timespan or timetable is reached
				// * A whole period is completed, data is repeated so try in the next leaf/timetable
				while ((!endOfTimetable || cursor.isBefore(endOfTimetable)) && cursor.isBefore(endOfPeriod)) {
					var slice = Calendar.sliceInTimeTable(cursor, timetable);
					var start = _.reduce(slice.workingTimes, function(start, workingTime, index, workingTimes) {
						if (Calendar.isWithinWorkingTime(cursor, workingTime)) {
							// If inside return the cursor time
							return cursor;
						} else if (Calendar.isBeforeWorkingTime(cursor, workingTime)) {
							// If working time is after, return the minimum beginning
							var beginning = Calendar.workingTimeBeginning(cursor, workingTime)
							return start == 0 ? beginning : Moment.min(start, beginning);
						} else {
							// If working time is before ignore
							return start;
						}
					}, 0, this);
					// If start found return
					if (!!start) {
						return start;
					}
					// If not, try in the next leaf/timetable
					cursor.add(timetable.increment.value, timetable.increment.units);
				}
				// No start found in this timespan, search in the following
				if (!!endOfTimetable) {
					return this.upcomingWorkingTime(endOfTimetable, calendar);
				}
				// If endOfTimetable is null, it is because this was the last leaf in calendar tree, the last timespan in time
				else {
					throw "No actual start possible when no start found in this timespan and there is no following timespan";
				}
			},
		}
		
	} ]);
	
});
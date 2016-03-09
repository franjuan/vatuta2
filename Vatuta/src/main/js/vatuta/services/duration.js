define([ "moment", "lodash", "vatuta/vatutaMod" ], function(Moment, _) {
// TODO Create specs test file for calendar
	angular.module('vatuta').factory('DurationHandler', ["CalendarHandler", function(Calendar) {
		return {
			// TODO Test cases
			addTo: function(moment, duration, calendar) {
				
			},
			actualStart: function(moment, duration, calendar) {
				var timetable = searchTimeTable(moment, calendar);
				_.forEach(timetable.intervals, function(interval, index, intervals){
					var start = Moment(moment).hours(interval.from.hours).minutes(interval.from.minutes || 0).seconds(interval.from.seconds || 0);
					var end = Moment(moment).hours(interval.to.hours).minutes(interval.to.minutes || 0).seconds(interval.to.seconds || 0);
				});
			},
		}
		
	} ]);
	
});
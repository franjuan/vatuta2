define([ "moment", "lodash", "vatuta/vatutaMod", "vatuta/services/calendar" ], function(Moment, _) {
	angular.module('vatuta').factory('DurationHandler', ['CalendarHandler', function(Calendar) {
		return {
			// TODO Test cases
			addTo: function(moment, duration, calendar) {
				// Start of task
				var start = Calendar.upcomingWorkingTime(moment, calendar);
				// Calculate recursively the end
				var end = this.addRemainingTo(Moment(start), angular.copy(duration), calendar);
				return {start: start, end: end};
			},
			addRemainingTo: function(cursor, remaining, calendar) {
				// Extracted calendar data for moment
				var current = Calendar.searchNode(cursor, calendar);
				var timetable = current.leaf.timetable;
				// When timetable ends
				var endOfTimetable = current.highDate;
				// When timetable starts to repeat
				var endOfPeriod = Moment(cursor).add(timetable.period.value, timetable.period.units);
				// While duration still pending of apply and we have not changed the slice
				while (!this.isZero(remaining) && (!endOfTimetable || cursor.isBefore(endOfTimetable))) {
					// Get the biggest unit
					var unit = _.find(this.units, function(unit) { return remaining[unit] && remaining[unit] != 0; });
					var value = remaining[unit];
					var efectiveValue = Calendar.addWorkintTimeTo(cursor, value, unit, calendar);
					remaining[unit]-= efectiveValue.efectiveTime;
					cursor = efectiveValue.cursor;
				}
				if (this.isZero(remaining)) {
					return cursor;
				} else {
					return this.addRemainingTo(cursor, remaining, calendar);
				}
			},
			
			subtractFrom: function(moment, duration, calendar) {
				
			},
			units: ['years', 'quarters', 'months', 'weeks', 'days', 'hours', 'minutes', 'milliseconds'],
			aliases: {'years':'y', 'quarters':'q', 'months':'M', 'weeks':'w', 'days':'d', 'hours':'h', 'minutes':'m', 'milliseconds':'ms'},
			/**
			 * Returns true if duration has 0 length
			 * @returns if 0, false otherwise
			 */
			isZero: function(duration) {
				var zero = true;
				_.forEach(this.units, function(unit) {
					if (duration[unit] && duration[unit] != 0) {
						zero = false;
						return false;
					}
				}, this);
				return zero;
			}
		}
		
	} ]);
	
});
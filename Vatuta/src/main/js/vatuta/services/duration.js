define([ "moment", "lodash", "vatuta/vatutaMod" ], function(Moment, _) {
// TODO Create specs test file for calendar
	angular.module('vatuta').factory('DurationHandler', ["CalendarHandler", function(Calendar) {
		return {
			// TODO Test cases
			addTo: function(moment, duration, calendar) {
				
			},
			
		}
		
	} ]);
	
});
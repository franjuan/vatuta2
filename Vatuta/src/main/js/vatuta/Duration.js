/**
 * @module Duration
 */
define(["moment"], function(moment) {
	
	/**
	 * @constructor
	 * @alias module:Duration
	 */
	var units = ['years', 'quarters', 'months', 'weeks', 'days', 'hours', 'minutes', 'milliseconds'];
	return {
		/**
		 * Validates a string and returns a Duration object
		 * @param s String to validate
		 * @returns Duration object or string if error while validating
		 */
		validator: function(s) {
						var re = /(\d+)\s*([a-zA-Z]+)\s*/gi; 
						var duration = {};
						var match;
						while (match = re.exec(s)) {
							var unit = _.find(units, function(unit) {
								return unit.indexOf(match[2].toLowerCase()) == 0;
							})
							if (match[2].toLowerCase() == 'm' && (duration['months'] || duration['weeks'] || duration['days'] || duration['hours'])) {
								unit = 'minutes';
							}
							if ((match[2].toLowerCase() == 'm' || match[2].toLowerCase() == 'mi') && (duration['minutes'])) {
								unit = 'milliseconds';
							}
							var value = parseInt(match[1]);
							if (!unit) {
								return match[2] + " is not a valid time unit (y, M, w, d, h, m, s, ms)"; 
							} else {
								duration[unit] = value;
							}
						    console.log(value + "=" + match[2] + " - " + unit);
						}
						return duration;
					},
		/**
		 * Formats duration for display
		 * @param {Duration) Duration to print
		 * @returns String formatted
		 */
		formatter: function(duration) {
						var s = "";
						for (var i=0; i<units.length; i++) {
							var value = duration[units[i]];
						    if (value>0) {
						    	if (s) s+= " ";
						    	s+=value + " ";
						    	if (value == 1) {
						    		s+=units[i].substr(0, units[i].length - 1);
						    	} else {
						    		s+=units[i];
						    	}
						    	
						    }
						}
						return s;
					},
		/**
		 * Adds duration to {Moment} date
		 * @param {Moment) as date base
		 * @param {Duration) Duration to add
		 * @returns {Moment} date
		 */			
		add:		function(date, duration) {
						var m = moment(date);
						_.forEach(duration, function(value, key) {
							m.add(value, key);
						});
						return m;
					},
		/**
		 * Subtracts duration to {Moment} date
		 * @param {Moment) as date base
		 * @param {Duration) Duration to subtracts
		 * @returns {Moment} date
		 */
		subtract:	function(date, duration) {
						var m = moment(date);
						_.forEach(duration, function(value, key) {
							m.subtract(value, key);
						});
						return m;
		}
	}
});
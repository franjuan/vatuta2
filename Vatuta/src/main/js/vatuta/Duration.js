/**
 * @module Duration
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment" ], function(declare,
		lang, _, moment) {
	var Duration = declare("Duration", null, {
		/**
		 * @constructor
		 * @alias module:Duration
		 */
		constructor : function (/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		},
		/**
		 * Formats duration for display
		 * @returns String formatted
		 */
		formatter: function() {
			var s = "";
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					if (s) s+= " ";
			    	s+= this[unit] + " ";
			    	if (this[unit] == 1) {
			    		s+=unit.substr(0, unit.length - 1);
			    	} else {
			    		s+=unit;
			    	}
				}
			}, this);
			return s;
		},
		/**
		 * Formats duration for display
		 * @returns String formatted
		 */
		shortFormatter: function() {
			var s = "";
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					s+= this[unit] + Duration.aliases[unit];
				}
			}, this);
			return s;
		},
		/**
		 * Adds duration to {Moment} date
		 * @param {Moment) as date base
		 * @param {Duration) Duration to add
		 * @returns {Moment} date
		 */			
		addTo: function(date) {
			var m = moment(date);
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					m.add(this[unit], unit);
				}
			}, this);
			return m;
		},
		/**
		 * Subtracts duration to {Moment} date
		 * @param {Moment) as date base
		 * @param {Duration) Duration to subtracts
		 * @returns {Moment} date
		 */
		subtractFrom: function(date) {
			var m = moment(date);
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					m.subtract(this[unit], unit);
				}
			}, this);
			return m;
		},
		/**
		 * Returns true if duration has 0 length
		 * @returns if 0, false otherwise
		 */
		isZero: function() {
			var zero = true;
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					zero = false;
					return false;
				}
			}, this);
			return zero;
		}
	});
	
	/**
	 * Validates a string and returns a Duration object
	 * @param s String to validate
	 * @returns Duration object or string if error while validating
	 */
	Duration.validator= function(s) {
		var re = /(\-?\d+)\s*([a-zA-Z]+)\s*/gi; 
		var duration = new Duration();
		var match;
		while (match = re.exec(s)) {
			var unit = _.find(Duration.units, function(unit) {
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
		}
		if (!re.test(s)) return "It is not a valid duration";
		return duration;
	};
	Duration.units= ['years', 'quarters', 'months', 'weeks', 'days', 'hours', 'minutes', 'milliseconds'];
	Duration.aliases= {'years':'y', 'quarters':'q', 'months':'M', 'weeks':'w', 'days':'d', 'hours':'h', 'minutes':'m', 'milliseconds':'ms'};
	
	return Duration;
});
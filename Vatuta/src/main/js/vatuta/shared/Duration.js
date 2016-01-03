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
		formatter: function(negate) {
			var s = "";
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					if (s) s+= " ";
			    	s+= (negate?(-1*this[unit]):this[unit]) + " ";
			    	if (Math.abs(this[unit]) == 1) {
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
		shortFormatter: function(negate) {
			var s = "";
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					s+= (negate?(-1*this[unit]):this[unit]) + Duration.aliases[unit];
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
		},
		isNegative: function() {
			return this.moment().asMilliseconds() < 0;
		},
		humanize: function(showSuffix) {
			var suffix = "";
			if (showSuffix) {
				suffix = this.isNegative()?" before":" after";
			}
			return (this.isZero()?'':this.moment().humanize(false)) + suffix;
		},
		toString: function(showSuffix) {
			var suffix = "";
			if (showSuffix) {
				suffix = this.isNegative()?" before":" after";
			}
			var values = [];
			_.forEach(Duration.units, function(unit) {
				if (this[unit] && this[unit] != 0) {
					var u = ""
			    	if (Math.abs(this[unit]) == 1) {
			    		u=unit.substr(0, unit.length - 1);
			    	} else {
			    		u=unit;
			    	}
					values.push(((this.isNegative() && showSuffix)?(this[unit]*-1):this[unit]) + " " + u);
				}
			}, this);
			var s = ""
			for (var i=0; i < values.length - 1; i++) {
				if (s) {
					s+=", ";
				}
				s+= values[i];
			}
			if (s) {
				s+=" and ";
			}
			if (values.length > 0) s+= values[values.length - 1];
			return s + suffix;
		},
		moment: function() {
			if (!this._$moment) {
				this._$moment = moment.duration();
				_.forEach(Duration.units, function(unit) {
					if (this[unit] && this[unit] != 0) {
						this._$moment.add(this[unit], unit);
					}
				}, this);
			}
			return this._$moment;
		},
		getBiggestUnit: function() {
			var biggestUnit = 4; //days
			_.forEach(Duration.units, function(unit, index) {
				if (this[unit] && this[unit] != 0) {
					biggestUnit = index;
					return false;
				}
			}, this);
			return biggestUnit;
		},
		getSmallestUnit: function() {
			var smallestUnit = 4; //days
			_.forEach(Duration.units, function(unit, index) {
				if (this[unit] && this[unit] != 0) {
					smallestUnit = index;
				}
			}, this);
			return smallestUnit;
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
	
	/**
	 * Creates a duration object from moment.duration type
	 * @param moment moment.duration
	 * @returns Duration object from moment.duration
	 */
	Duration.fromMoment = function(moment) {
		var duration = new Duration();
		_.forEach(Duration.units, function(unit) {
			if (moment["_"+unit] && moment["_"+unit] != 0) {
				duration[unit] = moment["_"+unit];
			}
		}, duration);
		return duration;
	}
	
	/**
	 * Compares two durations
	 * @param a moment.duration
	 * @param b moment.duration
	 * @returns Returns 0 if equals, 1 if a > b and -1 if b > a 
	 */
	Duration.compare = function(a, b) {
		if (!a.isInstanceOf(Duration) || !b.isInstanceOf(Duration)) {
			return null;
		} else {
			if (a.moment().asMilliseconds() == b.moment().asMilliseconds()) {
				return 0;
			} else if (a.moment().asMilliseconds() > b.moment().asMilliseconds()) {
				return 1;
			} else {
				return 0;
			}
		}
	}
	
	return Duration;
});
define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "./vatuta/Duration.js", "./vatuta/baseTask.js" ], function(declare,
		lang, _, moment, DurationUtils, baseTask) {
	return declare("Task", baseTask, {
		constructor : function (/* Object */kwArgs) {
			this.inherited(arguments);
		},
		duration: function(newDuration) {
		    return arguments.length ? (this._duration = newDuration) : this._duration;
		},
		isEstimated: function(estimated) {
			return arguments.length ? (this._isEstimated = estimated) : this._isEstimated;
		},
//		hasRestrictionOnStart: function() {
//			if (_.reduce(this.restrictions(), function(start, restriction) {
//				  return start || restriction.onStart(this);
//				}, false, this)) {
//				return true;
//			}
//			if (_.reduce(this.restrictionsFromDependants(), function(start, restriction) {
//				  return start || restriction.onStart(this);
//				}, false, this)) {
//				return true;
//			}
//			return false;
//		},
//		hasRestrictionOnEnd: function() {
//			if (_.reduce(this.restrictions(), function(end, restriction) {
//				  return end || restriction.onFinish(this);
//				}, false, this)) {
//				return true;
//			}
//			if (_.reduce(this.restrictionsFromDependants(), function(end, restriction) {
//				  return end || restriction.onFinish(this);
//				}, false, this)) {
//				return true;
//			}
//			return false;
//		},
		getDefaultEarlyStart: function() {
			if (this.parent().earlyStart()) { // Forwards
				return this.parent().earlyStart();
			} else {
				return 0;
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.parent().earlyEnd()) { // Backwards
				return this.parent().earlyEnd();
			} else {
				return Infinity;
			}
		},
		getDefaultLateStart: function() {
			return this.parent().lateEnd()?this.duration().subtractFrom(this.parent().lateEnd()):NaN;
		},
		getDefaultLateEnd: function() {
			return this.parent().lateEnd()?this.parent().lateEnd():NaN;
		},
		hasFixedDuration: function() {
			return !this.isEstimated();
		},
		watchHash: function() {
			return this.id() + this.index() + this.name() + this.description() + this.duration().shortFormatter() +
				_.reduce(
						_.map(this.restrictions(), function(restriction) {
														return restriction.watchHash();
													}), function(total, value) {
															return total + value;
														}
						);
		}
	});
});
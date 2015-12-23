define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/Duration", "vatuta/baseTask" ], function(declare,
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
		getDefaultEarlyStart: function() {
			if (this.earlyStart()) {
				return this.earlyStart();
			} else if (this.earlyEnd() && this.hasFixedDuration()) {
				return this.duration().subtractFrom(this.earlyEnd());
			} else if (this.parent().earlyStart()) {
				return this.parent().earlyStart();
			} else {
				return 0;
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.earlyEnd()) {
				return this.earlyEnd();
			} else if (this.earlyStart() && this.hasFixedDuration()) {
				return this.duration().addTo(this.earlyStart());
//			} else if (this.parent().earlyEnd()) {
//				return this.parent().earlyEnd();
			} else {
				return Infinity;
			}
		},
		getDefaultLateStart: function() {
			if (this.lateStart()) {
				return this.lateStart();
			} else if (this.lateEnd() && this.hasFixedDuration()) {
				return this.duration().subtractFrom(this.lateEnd());
//			} else if (this.parent().earlyEnd()) {
//				return this.parent().earlyEnd();
			} else {
				return 0;
			}
		},
		getDefaultLateEnd: function() {
			if (this.lateEnd()) {
				return this.lateEnd();
			} else if (this.lateStart() && this.hasFixedDuration()) {
				return this.duration().addTo(this.lateStart());
			} else if (this.parent().lateEnd()) {
				return this.parent().lateEnd();
			} else {
				return Infinity;
			}
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
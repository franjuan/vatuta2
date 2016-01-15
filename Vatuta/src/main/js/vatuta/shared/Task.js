define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/shared/Duration", "vatuta/shared/BaseTask" ], function(declare,
		lang, _, moment, DurationUtils, BaseTask) {
	return declare("Task", BaseTask, {
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
			} else if (this.earlyEnd()) {
				return this.duration().subtractFrom(this.earlyEnd());
			}  else {
				var parent = this.iterateDepthForProperty("earlyStart");
				return parent?parent:0;
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.earlyEnd()) {
				return this.earlyEnd();
			} else if (this.earlyStart()) {
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
			} else if (this.lateEnd()) {
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
			} else if (this.lateStart()) {
				return this.duration().addTo(this.lateStart());
			} else {
				var parent = this.iterateDepthForProperty("lateEnd");
				return parent?parent:Infinity;
			}
		},
		hasFixedDuration: function() {
			return !this.isEstimated();
		},
		applyTacticToPlannedRange4Start: function(plannedStartRange) {
			if (!this.earlyStart().isSame(plannedStartRange[0])) {
				this.earlyStart(plannedStartRange[0]);
				if (!this.isEstimated()) {
					this.earlyEnd(this.duration().addTo(plannedStartRange[0]))
				}
			}
			if (!this.lateStart().isSame(plannedStartRange[1])) {
				this.lateStart(plannedStartRange[1]);
				if (!this.isEstimated()) {
					this.lateEnd(this.duration().addTo(plannedStartRange[1]))
				}
			}
			return this.actualStart(this.tactic().getPlannedStartInRange4Task(this, plannedStartRange));
		},
		applyTacticToPlannedRange4End: function(plannedEndRange) {
			if (!this.earlyEnd().isSame(plannedEndRange[0])) {
				this.earlyEnd(plannedEndRange[0]);
				if (!this.isEstimated()) {
					this.earlyStart(this.duration().subtractFrom(plannedEndRange[0]))
				}
			}
			if (!this.lateEnd().isSame(plannedEndRange[1])) {
				this.lateEnd(plannedEndRange[1]);
				if (!this.isEstimated()) {
					this.lateStart(this.duration().subtractFrom(plannedEndRange[1]))
				}
			}
			return this.actualEnd(this.tactic().getPlannedEndInRange4Task(this, plannedEndRange));
		},
		watchHash: function() {
			return this.id() + this.index() + this.name() + this.description() + (this.duration()?this.duration().shortFormatter():"") + this.tactic().name() +
				(this.tactic().name() == 'Manual'?(this.actualStart().toString() + this.actualEnd().toString()):"") +
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
define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/shared/Duration", "vatuta/shared/BaseTask", "vatuta/shared/Tactics" ], function(declare,
		lang, _, moment, DurationUtils, BaseTask, Tactics) {
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
			} else if (this.tactic().equals(Tactics.MANUAL)) {
				return this.manualStart();
			} else if (this.earlyEnd()) {
				return this.duration().subtractFrom(this.earlyEnd());
			}  else {
				return -Infinity;
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.earlyEnd()) {
				return this.earlyEnd();
			} else if (this.tactic().equals(Tactics.MANUAL)){
				return this.manualEnd();
			} else if (this.earlyStart()) {
				return this.duration().addTo(this.earlyStart());
			} else {
				return Infinity;
			}
		},
		getDefaultLateStart: function() {
			if (this.lateStart()) {
				return this.lateStart();
			} else if (this.manualStart()) {
				return this.manualStart();
			} else if (this.lateEnd()) {
				return this.duration().subtractFrom(this.lateEnd());
			} else {
				return -Infinity;
			}
		},
		getDefaultLateEnd: function() {
			if (this.lateEnd()) {
				return this.lateEnd();
			} else if (this.manualEnd()) {
				return this.manualEnd();
			} else if (this.lateStart()) {
				return this.duration().addTo(this.lateStart());
			} else {
				var parent = this.iterateDepthForProperty("lateEnd");
				return parent?parent:Infinity;
			}
		},
		getRestrictionsForScheduling: function(constraints) {
			return this.getRestrictionsFor([this.restrictions(), this.restrictionsFromDependants()], constraints);
		},
		getRestrictionsFor: function(types, constraints) {
			if (!constraints) {
				var constraints = [];
			}
			_.forEach(types, function(restrictions) {
				_.forEach(restrictions, function(restriction) {
					constraints.push(restriction);
				}, this);
			}, this);
			if (this.parent().getRestrictionsFor) {
				this.parent().getRestrictionsForScheduling(constraints);
			}
			return constraints;
		},
		applyRestrictionForEarlyStart: function(restriction, earlyStart) {
			var restrictionValue = restriction.getMinEarlyStart4Task.call(restriction, this);
			if (!moment.isMoment(restrictionValue) && isFinite(restrictionValue)) {
				return false
			} else if (isFinite(restrictionValue)) {
				// TODO Si incoherencia avisar
				if (!isFinite(earlyStart)) {
					return restrictionValue;
				} else {
					return moment.max(earlyStart, restrictionValue);
				}
			} else {
				return earlyStart;
			}
		},
		applyRestrictionForEarlyEnd: function(restriction, earlyEnd) {
			var restrictionValue = restriction.getMinEarlyEnd4Task.call(restriction, this);
			if (!moment.isMoment(restrictionValue) && isFinite(restrictionValue)) {
				return false
			} else if (isFinite(restrictionValue)) {
				// TODO Si incoherencia avisar
				if (!isFinite(earlyEnd)) {
					return restrictionValue;
				} else {
					return moment.max(earlyEnd, restrictionValue);
				}
			} else {
				return earlyEnd;
			}
		},
		applyEarlyStart: function(earlyStart) {
			if (moment.isMoment(earlyStart)) {
				if (this.earlyEnd() && earlyStart.isAfter(this.earlyEnd()) ){
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", early end " + this.earlyEnd().toString() + " is before than early start " + earlyStart.ToString(),
						task: this,
						error: "StartEndConstraint"
						}
				}
				if (this.earlyEnd() && !this.isEstimated() && this.duration().addTo(earlyStart).isAfter(this.earlyEnd()) ){
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", early end " + this.earlyEnd().toString() + " is smaller than early start " + earlyStart.ToString() + " with duration added",
						task: this,
						error: "DurationConstraint"
						}
				}
				this.earlyStart(earlyStart);
				return true;
			} else return false;
		},
		applyEarlyEnd: function(earlyEnd) {
			if (moment.isMoment(earlyEnd)) {
				if (this.earlyStart() && earlyEnd.isBefore(this.earlyStart()) ){
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", early end " + this.earlyEnd().toString() + " is before than early start " + earlyEnd.ToString(),
						task: this,
						error: "StartEndConstraint"
						}
				}
				if (this.earlyStart() && !this.isEstimated() && this.duration().addTo(this.earlyStart()).isAfter(earlyEnd) ){
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", early end " + this.earlyEnd().toString() + " is smaller than early start " + earlyEnd.ToString() + " with duration added",
						task: this,
						error: "DurationConstraint"
						}
				}
				this.earlyEnd(earlyEnd);
				return true;
			} else return false;
		},
		applyPlannedStartRange2Task: function(plannedStartRange) {
			if (plannedStartRange[0]!=0 && this.earlyStart().isBefore(plannedStartRange[0])) {
				this.earlyStart(plannedStartRange[0]);
				this.earlyEnd(this.duration().addTo(plannedStartRange[0]))
			}
			if (isFinite(plannedStartRange[1]) && this.lateStart().isAfter(plannedStartRange[1])) {
				this.lateStart(plannedStartRange[1]);
				this.lateEnd(this.duration().addTo(plannedStartRange[1]))
			}
		},
		applyPlannedEndRange2Task: function(plannedEndRange) {
			if (plannedEndRange[0]!=0 && this.earlyEnd().isBefore(plannedEndRange[0])) {
				this.earlyEnd(plannedEndRange[0]);
				this.earlyStart(this.duration().subtractFrom(plannedEndRange[0]))
			}
			if (isFinite(plannedEndRange[1]) && this.lateEnd().isAfter(plannedEndRange[1])) {
				this.lateEnd(plannedEndRange[1]);
				this.lateStart(this.duration().subtractFrom(plannedEndRange[1]))
			}
		},
		applyTactic2PlannedStartRange4PlannedStart: function(plannedStartRange) {
			return this.actualStart(this.tactic().getPlannedStartInRange4Task(this, plannedStartRange));
		},
		applyTactic2PlannedEndRange4PlannedEnd: function(plannedEndRange) {
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
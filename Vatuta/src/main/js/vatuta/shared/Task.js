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
			} else if (this.manualStart() && task.tactic().equals(Tactics.MANUAL)) {
				return this.manualStart();
			} else if (this.earlyEnd()) {
				return this.duration().subtractFrom(this.earlyEnd());
			}  else {
				return 0;
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.earlyEnd()) {
				return this.earlyEnd();
			} else if (this.manualEnd()){
				return this.manualEnd();
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
			} else if (this.manualStart()) {
				return this.manualStart();
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
			} else if (this.manualEnd()) {
				return this.manualEnd();
			} else if (this.lateStart()) {
				return this.duration().addTo(this.lateStart());
			} else {
				var parent = this.iterateDepthForProperty("lateEnd");
				return parent?parent:Infinity;
			}
		},
		getRestrictionsForScheduling: function() {
			return this.getRestrictionsFor([this.restrictions(), this.restrictionsFromDependants()]);
		},
		getRestrictionsFor: function(restrictions, constraints) {
			if (!constraints) {
				var constraints = [];
			}
			_.forEach(restrictions, function(restrictions) {
				_.forEach(restrictions, function(restriction) {
					constraints.push(restriction);
				}, task);
			}, task);
			if (this.parent().getRestrictionsFor) {
				task.parent().getRestrictionsFor(restrictions, constraints);
			}
			return constraints;
		},
		applyRestrictionForEarlyStart: function(restriction, earlyStart) {
			var restrictionValue = restriction.getMinEarlyStart4Task.call(restriction, this);
			if (!restrictionValue) {
				return false
			} else if (restrictionValue != 0) {
				// TODO Si incoherencia avisar
				if (earlyStart == 0) {
					return restrictionValue;
				} else {
					return moment.max(earlyStart, restrictionValue);
				}
			} else {
				return earlyStart;
			}
		},
		applyEarlyStart: function(earlyStart) {
			if (earlyStart && earlyStart != 0) {
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
				this.earlyEnd(this.duration().addTo(earlyStart));
				return true;
			} else return false;
		},
		hasFixedDuration: function() {
			return !this.isEstimated();
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
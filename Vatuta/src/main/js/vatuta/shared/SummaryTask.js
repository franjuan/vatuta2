define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/shared/Duration", "vatuta/shared/BaseTask",  "vatuta/shared/Tactics" ], function(declare,
		lang, _, moment, DurationUtils, BaseTask, Tactics) {
	return declare("SummaryTask", BaseTask, {
		constructor : function (/* Object */kwArgs) {
			this._children = [];
			this.inherited(arguments);
		},
		// TODO Repasar, no funciona
		setViewIndexes: function(index, treeLevel) {
	    	 this._index = index;
	    	 this.index(index);
	    	 this.treeLevel(treeLevel);
	    	 _.forEach(this.children(), function(task) {
		    		 index++;	
		    		 index = task.setViewIndexes(index, treeLevel + 1);
				}, this);
	    	 return index;
		},
		maxIndex: function() {
			return _.reduce(this.children(), function(max, child) {
				return child.maxIndex?Math.max(max,child.maxIndex()):Math.max(max,child.index());
			}, this.index(), this);
		},
		duration: function(newDuration) {
		    return false;
		},
		isEstimated: function(estimated) {
			return _.reduce(this.children(), function(estimated, child) {
				return estimated || child.isEstimated();
			}, false, this);
		},
		tactic: function(newTactic) {
			return Tactics.getTacticInstanceByName("ASAP"); 
		},
		remove: function() {
			this.inherited(arguments);
			_.forEach(this.children(), function(child) {
				child.remove();
			}, this);
			this._children = [];
		},
		children: function() {
			return this._children;
		},
		/**
		 * Do not call, use Project.addTask instead
		 * @function
		 * @memberof Project
		 */
		addTask : function(task, index) {
			var i = !isNaN(index) ? index : this.children().length;
			this.children().splice(i, 0, task);
			task.parent(this);
			return task;
		},
		removeTask: function(task) {
			// Remove task from project
			_.remove(this.children(), "_id", task.id());
			return task;
		},
		replaceTask: function(task) {
			 // Find element in project
			 var index = _.findIndex(this.children(), "_id", task.id());
			 this.children()[index] = task;
			 return task;
		},
		earlyStart: function(newEarlyStart) {
			if (arguments.length) {
				this._earlyStart = newEarlyStart;
			} else {
				if (this._earlyStart) {
					return this._earlyStart;
				} else {
					var earlyStart = this.calculatedEarlyStart();
					return isNaN(earlyStart)?undefined:earlyStart;
				}
			}
		},
		earlyEnd: function(newEarlyEnd) {
			if (arguments.length) {
				this._earlyEnd = newEarlyEnd;
			} else {
				if (this._earlyEnd) {
					return this._earlyEnd;
				} else {
					var earlyEnd = this.calculatedEarlyEnd();
					return isNaN(earlyEnd)?undefined:earlyEnd;
				}
			}
		},
		lateStart: function(newLateStart) {
			if (arguments.length) {
				this._lateStart = newLateStart;
			} else {
				if (this._lateStart) {
					return this._lateStart;
				} else {
					var lateStart = this.calculatedLateStart();
					return isNaN(lateStart)?undefined:lateStart;
				}
			}
		},
		lateEnd: function(newLateEnd) {
			if (arguments.length) {
				this._lateEnd = newLateEnd;
			} else {
				if (this._lateEnd) {
					return this._lateEnd;
				} else {
					var lateEnd = this.calculatedLateEnd();
					return isNaN(lateEnd)?undefined:lateEnd;
				}
			}
		},
		calculatedEarlyStart: function() {
			return _.reduce(this.children(), function(min, child) {
				if (!isNaN(min) && child.earlyStart()) {
					return min==0?child.earlyStart():moment.min(min, child.earlyStart());
				} else {
					return NaN;
				}
			}, 0, this);
		},
		calculatedEarlyEnd: function() {
			return _.reduce(this.children(), function(max, child) {
				if (!isNaN(max) && child.earlyEnd()) {
					return max==0?child.earlyEnd():moment.max(max, child.earlyEnd());
				} else {
					return NaN;
				}
			}, 0, this);
		},
		calculatedLateStart: function() {
			return _.reduce(this.children(), function(min, child) {
				if (!isNaN(min) && child.lateStart()) {
					return min==0?child.lateStart():moment.min(min, child.lateStart());
				} else {
					return NaN;
				}
			}, 0, this);
		},
		calculatedLateEnd: function() {
			return _.reduce(this.children(), function(max, child) {
				if (!isNaN(max) && child.lateEnd()) {
					return max==0?child.lateEnd():moment.max(max, child.lateEnd());
				} else {
					return NaN;
				}
			}, 0, this);
		},
		getDefaultEarlyStart: function() {
			if (this.earlyStart()) {
				return this.earlyStart();
			} else {
				var earlyStart = this.calculatedEarlyStart();
				if (!isNaN(earlyStart)) {
					return earlyStart;
				} else {
					return -Infinity;
				}
			}
		},
		getDefaultEarlyEnd: function() {
			if (this.earlyEnd()) {
				return this.earlyEnd();
			} else {
				var earlyEnd = this.calculatedEarlyEnd();
				if (!isNaN(earlyEnd)) {
					return earlyEnd;
				} else {
					return Infinity;
				}
			}
		},
		getDefaultLateStart: function() {
			if (this.lateStart()) {
				return this.lateStart();
			} else {
				var lateStart = this.calculatedLateStart();
				if (!isNaN(lateStart)) {
					return lateStart;
				} else {
					return -Infinity;
				}
			}
		},
		getDefaultLateEnd: function() {
			if (this.lateEnd()) {
				return this.lateEnd();
			} else {
				var lateEnd = this.calculatedLateEnd();
				if (!isNaN(lateEnd)) {
					return lateEnd;
				} else {
					return Infinity;
				}
			}
		},
		getRestrictionsForScheduling: function(constraints) {
			return this.getRestrictionsFor([this.restrictions(), this.restrictionsFromDependants()], constraints);
		},
		getRestrictionsForPlanning: function(constraints) {
			return this.getRestrictionsFor([this.restrictions()], constraints);
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
			return constraints;
		},
		applyRestrictionFor: function(f, restriction, date) {
			var restrictionValue = f.call(restriction, this);
			if (!moment.isMoment(restrictionValue) && isFinite(restrictionValue)) {
				return false
			} else {
				// TODO Si incoherencia avisar
				return date;
			}
		},
		applyRestrictionForEarlyStart: function(restriction, earlyStart) {
			return this.applyRestrictionFor(restriction.getMinEarlyStart4Task, restriction, earlyStart);
		},
		applyRestrictionForEarlyEnd: function(restriction, earlyEnd) {
			return this.applyRestrictionFor(restriction.getMinEarlyEnd4Task, restriction, earlyEnd);
		},
		applyRestrictionForLateStart: function(restriction, lateStart) {
			return this.applyRestrictionFor(restriction.getMaxLateStart4Task, restriction, lateStart);
		},
		applyRestrictionForLateEnd: function(restriction, lateEnd) {
			return this.applyRestrictionFor(restriction.getMaxLateEnd4Task, restriction, lateEnd);
		},
		applyRestrictionForPlannedStart: function(restriction, plannedStartRange) {
			var restrictionRange = restriction.getPlannedStartRange4Task.call(restriction, this);
			if (!restrictionRange || (!restrictionRange[0] && !restrictionRange[1])) {
				return false
			} else {
				var union = this.rangeUnion(plannedStartRange, restrictionRange);
				if (!union) {
					// TODO Incluir el error en la restricción para mostrarlo
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", restriction " + restriction.shortDescription() + " is not achievable.",
						task: this,
						error: "UnachievableConstraint"
						}
					return plannedStartRange;
				}
				return union;
			}
		},
		applyRestrictionForPlannedEnd: function(restriction, plannedEndRange) {
			var restrictionRange = restriction.getPlannedEndRange4Task.call(restriction, this);
			if (!restrictionRange || (!restrictionRange[0] && !restrictionRange[1])) {
				return false
			} else {
				var union = this.rangeUnion(plannedEndRange, restrictionRange);
				if (!union) {
					// TODO Incluir el error en la restricción para mostrarlo
					throw {
						message: "Error at task " + this.index() + ".- " + this.name() + ", restriction " + restriction.shortDescription() + " is not achievable.",
						task: this,
						error: "UnachievableConstraint"
						}
					return plannedEndRange;
				}
				return union;
			}
		},
		applyEarlyStart: function(earlyStart) {
			if (moment.isMoment(earlyStart) && earlyStart.isSame(this.calculatedEarlyStart())) {
				this.earlyStart(earlyStart);
				return true;
			} else return false;
		},
		applyEarlyEnd: function(earlyEnd) {
			if (moment.isMoment(earlyEnd) && earlyEnd.isSame(this.calculatedEarlyEnd())) {
				this.earlyEnd(earlyEnd);
				return true;
			} else return false;
		},
		applyLateStart: function(lateStart) {
			if (moment.isMoment(lateStart) && lateStart.isSame(this.calculatedLateStart())) {
				this.lateStart(lateStart);
				return true;
			} else return false;
		},
		applyLateEnd: function(lateEnd) {
			if (moment.isMoment(lateEnd) && lateEnd.isSame(this.calculatedLateEnd())) {
				this.lateEnd(lateEnd);
				return true;
			} else return false;
		},
		actualStart: function(newActualStart) {
			return _.reduce(this.children(), function(min, child) {
					if (!isNaN(min) && child.actualStart() && !isNaN(child.actualStart())) {
						return min==0?child.actualStart():moment.min(min, child.actualStart());
					} else {
						return NaN;
					}
				}, 0, this);
		},
		actualEnd: function(newActualEnd) {
			return _.reduce(this.children(), function(max, child) {
				  if (!isNaN(max) && child.actualEnd() && !isNaN(child.actualEnd())) {
					  	return max==0?child.actualEnd():moment.max(max, child.actualEnd());
					} else {
						return NaN;
					}
				}, 0, this);
		},
		actualDuration: function(newActualDuration) {
			if (!this.actualEnd() || !this.actualStart()) {
				return NaN;
			}
			var max = _.reduce(this.children(), function(max, child) {
				return Math.max(max, child.actualDuration().getSmallestUnit());
				}, 0, this);
			var unit = Duration.units[max];
			var value = this.actualEnd().diff(this.actualStart(), unit, true);
			var duration = new Duration();
			duration[unit] = value;
			return duration
		},
		applyPlannedStart: function(plannedStartRange) {
			var isActualStart = true;
			_.forEach(this.children(), function(task) {
				isActualStart = isActualStart && !!task.actualStart();
	    		 // TODO Revisar que early no sea posterior a late
			}, this);
			return isActualStart?[this.earlyStart(),this.lateStart()]:false;
		},
		applyPlannedEnd: function(plannedEndRange) {
			var isActualEnd = true;
			_.forEach(this.children(), function(task) {
				isActualEnd = isActualEnd && !!task.actualEnd();
	    		 // TODO Revisar que early no sea posterior a late
			}, this);
			return isActualEnd?[this.earlyEnd(),this.lateEnd()]:false;
		},
		applyTactic4PlannedStart: function(plannedStartRange) {
			return this.actualStart()
		},
		applyTactic4PlannedEnd: function(plannedEndRange) {
			return this.actualEnd();
		},
		watchHash: function() {
			// TODO Include duration in watch function
			return this.id() + this.index() + this.name() + this.description() + //this.duration().shortFormatter() +
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
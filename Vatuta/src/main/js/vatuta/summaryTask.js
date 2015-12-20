define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/Duration", "vatuta/baseTask" ], function(declare,
		lang, _, moment, DurationUtils, baseTask) {
	return declare("summaryTask", baseTask, {
		constructor : function (/* Object */kwArgs) {
			this._children = [];
			this.inherited(arguments);
		},
		duration: function(newDuration) {
		    return NaN;
		},
		isEstimated: function(estimated) {
			return _.reduce(this.children(), function(estimated, child) {
				return estimated || child.isEstimated();
			}, false, this);
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
		 * @function
		 * @memberof Project
		 */
		addTask : function(task) {
			this.children().push(task);
			task.parent(this);
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
		getDefaultEarlyStart: function() {
			var earlyStart = this.calculatedEarlyStart();
			if (!isNaN(earlyStart)) {
				return earlyStart;
			} else {
				return this.parent().earlyStart()?this.parent().earlyStart():0;
			}
		},
		getDefaultEarlyEnd: function() {
			var earlyEnd = this.calculatedEarlyEnd();
			if (!isNaN(earlyEnd)) {
				return earlyEnd;
			} else {
				return this.parent().earlyEnd()?this.parent().earlyEnd():Infinity;
			}
		},
		getDefaultLateStart: function() {
			return _.reduce(this.children(), function(min, child) {
				if (!isNaN(min) && child.lateStart()) {
					return min==0?child.lateStart():moment.min(min, child.lateStart());
				} else {
					return NaN;
				}
			}, 0, this);
		},
		getDefaultLateEnd: function() {
			return this.parent().lateEnd()?this.parent().lateEnd():NaN;
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
			return moment.duration(this.actualEnd().diff(this.actualStart()));
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
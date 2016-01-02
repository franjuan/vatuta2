define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "vatuta/shared/Duration", "vatuta/shared/BaseTask" ], function(declare,
		lang, _, moment, DurationUtils, BaseTask) {
	return declare("SummaryTask", BaseTask, {
		constructor : function (/* Object */kwArgs) {
			this._children = [];
			this.inherited(arguments);
		},
		index: function(newIndex) {
		     if (arguments.length) {
		    	 this._index = newIndex;
		    	 var index = newIndex;
		    	 _.forEach(this.children(), function(task) {
			    		 index++;	
			    		 index = task.index(index);
					}, this);
		    	 return index;
		     } else {
		    	 return this._index;
		     }
		},
		maxIndex: function() {
			return _.reduce(this.children(), function(max, child) {
				return child.maxIndex?Math.max(max,child.maxIndex()):Math.max(max,child.index());
			}, this.index(), this);
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
		 * Do not call, use Project.addTask instead
		 * @function
		 * @memberof Project
		 */
		addTask : function(task) {
			this.children().push(task);
			task.parent(this);
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
			var earlyStart = this.calculatedEarlyStart();
			if (!isNaN(earlyStart)) {
				return earlyStart;
			} else {
				var parent = this.iterateDepthForProperty("earlyStart");
				return parent?parent:0;
			}
		},
		getDefaultEarlyEnd: function() {
			var earlyEnd = this.calculatedEarlyEnd();
			if (!isNaN(earlyEnd)) {
				return earlyEnd;
			} else {
				return Infinity;
			}
		},
		getDefaultLateStart: function() {
			var lateStart = this.calculatedLateStart();
			if (!isNaN(lateStart)) {
				return lateStart;
			} else {
				return 0;
			}
		},
		getDefaultLateEnd: function() {
			var lateEnd = this.calculatedLateEnd();
			if (!isNaN(lateEnd)) {
				return lateEnd;
			} else {
				var parent = this.iterateDepthForProperty("lateEnd");
				return parent?parent:Infinity;
			}
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
				return Math.max(max, child.actualDuration().getBiggestUnit());
				}, 0, this);
			var unit = Duration.units[max];
			var value = this.actualEnd().diff(this.actualStart(), unit, true);
			var duration = new Duration();
			duration[unit] = value;
			return duration
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
define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "./vatuta/Duration.js", "./vatuta/baseTask.js" ], function(declare,
		lang, _, moment, DurationUtils, baseTask) {
	return declare("summaryTask", baseTask, {
		constructor : function (/* Object */kwArgs) {
			this._children = [];
			this.inherited(arguments);
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
		getDefaultEarlyStart: function() {
			return this.parent().earlyStart()?this.parent().earlyStart():NaN;
		},
		getDefaultEarlyEnd: function() {
			return _.reduce(this.children(), function(max, child) {
				if (!isNaN(max) && child.earlyEnd()) {
					return max==0?child.earlyEnd():moment.max(max, child.earlyEnd());
				} else {
					return NaN;
				}
			}, 0, this);
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
		hasFixedDuration: function() {
			return false;
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
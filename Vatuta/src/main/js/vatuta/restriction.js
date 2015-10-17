/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	/**
     * @exports Restriction
     */
	var Restriction = declare("Vatuta.Restriction", null, {
		/**
		 * @constructs Restriction
		 */
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		}
	});
	
	/**
     * @exports Restriction
     */
	var EndToStartDependency = declare("Vatuta.EndToStartDependency", Restriction, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
			this.getEndingTask().addRestriction(this);
			this.getStartingTask().addRestriction(this);
		},
		getEndingTask: function() {
			return this._endingTask;
		},
		getStartingTask: function() {
			return this._startingTask;
		},
		getDependants4Task: function(task) {
			if (task.id()===this.getEndingTask().id()) {
				return [this.getStartingTask()];
			} else {
				return [];
			}
		},
		getDependencies4Task: function(task) {
			if (task.id()===this.getStartingTask().id()) {
				return [this.getEndingTask()];
			} else {
				return [];
			}
		},
		getEarlyStart: function(task) {
			if (task.id()===this.getStartingTask().id()) {
				if (this.getEndingTask().getEarlyEnd()) {
					return this.getEndingTask().getEarlyEnd();
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getLateEnd: function(task) {
			if (task.id()===this.getEndingTask().id()) {
				if (this.getStartingTask().getLateStart()) {
					return this.getStartingTask().getLateStart();
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		}
	});
	
	return {EndToStart: EndToStartDependency};
});
/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/engine.js"], function(declare, lang, Engine) {
	/**
     * @exports Restriction
     */
	var Restriction = declare("Restriction", null, {
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
	var EndToStartDependency = declare("EndToStartDependency", Restriction, {
		constructor: function(/* Object */kwArgs) {
			if (kwArgs._startingTask) {
				kwArgs._startingTaskId = kwArgs._startingTask.id();
				delete kwArgs._startingTask;
			}
			if (kwArgs._endingTask) {
				kwArgs._endingTaskId = kwArgs._endingTask.id();
				delete kwArgs._endingTask;
			}
			this.inherited(arguments);
			this.getEndingTask().addRestriction(this);
			this.getStartingTask().addRestriction(this);
		},
		getEndingTask: function() {
			return Engine.taskById(this._endingTaskId);
		},
		getStartingTask: function() {
			return Engine.taskById(this._startingTaskId);
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
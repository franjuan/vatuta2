/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/engine.js", "./vatuta/Duration.js"], function(declare, lang, Engine, DurationUtils) {
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
			this.endingTask().addRestrictionFromDependants(this);
			this.startingTask().addRestriction(this);
		},
		endingTask: function() {
			return Engine.taskById(this._endingTaskId);
		},
		startingTask: function() {
			return Engine.taskById(this._startingTaskId);
		},
		delay: function(newDuration) {
			return arguments.length ? (this._duration = newDuration) : (this._duration ? this._duration : {days:0});
		},
		getDependants4Task: function(task) {
			if (!task || task.id()===this.endingTask().id()) {
				return [this.startingTask()];
			} else {
				return [];
			}
		},
		getDependencies4Task: function(task) {
			if (!task || task.id()===this.startingTask().id()) {
				return [this.endingTask()];
			} else {
				return [];
			}
		},
		getEarlyStart: function(task) {
			if (!task || task.id()===this.startingTask().id()) {
				if (this.endingTask().earlyEnd()) {
					return DurationUtils.add(this.endingTask().earlyEnd(), this.delay());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getLateEnd: function(task) {
			if (!task || task.id()===this.endingTask().id()) {
				if (this.startingTask().lateStart()) {
					return DurationUtils.subtract(this.startingTask().lateStart(), this.delay());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		template: 'EndToStartDependencyItem.html',
		watchHash: function() {
			return this._endingTaskId + 'FS' + this._startingTaskId;
		},
		shortTitle: function() {
			var delayText = DurationUtils.shortFormatter(this.delay());
			return this.endingTask().index()+'FS'+(_.isEmpty(delayText)?'':' + '+delayText);
		}
	});
	
	return {EndToStart: EndToStartDependency};
});
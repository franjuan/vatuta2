/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/engine.js", "./vatuta/Duration.js"], function(declare, lang, Engine, Duration) {
	/**
     * @exports Restriction
     */
	var Restriction = declare("Restriction", null, {
		/**
		 * @constructs Restriction
		 */
		constructor : function(/* Object */kwArgs) {
			this._duration = new Duration();
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
			return arguments.length ? (this._duration = newDuration) : this._duration;
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
					return this.delay().addTo(this.endingTask().earlyEnd());
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
					return this.delay().subtractFrom(this.startingTask().lateStart());
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
		shortDescription: function() {
			return this.endingTask().index()+'FS'+(this.delay().isZero()?'':(' + '+this.delay().shortFormatter()));
		},
		longDescription: function() {
			return this.type() + " restriction between the task " + this.startingTask().index() + ".- " + this.startingTask().name() + " that starts when " + this.endingTask().index() + ".- " + this.endingTask().name()+ " finishes.";
		},
		type: function() {
			return "Finish-Start";
		},
		remove: function() {
			this.startingTask().removeRestriction(this);
			this.endingTask().removeRestrictionFromDependants(this);
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor) && this._startingTaskId == other._startingTaskId && this._endingTaskId == other._endingTaskId) {
				return true;
			} else return false; 
		}
	});
	
	return {EndToStart: EndToStartDependency};
});
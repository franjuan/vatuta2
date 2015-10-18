/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
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
		},
		jsonify: function () {
			return {_startingTaskId: this._startingTask.id(), _endingTaskId: this._endingTask.id(), _class: this.__proto__.declaredClass};
		},
		prepareAfterLoading: function(project, namespace) {
		}
	});
	EndToStartDependency.objectify = function(json, project, task, namespace) {
		if (task.id() == json._endingTaskId) {
			var _class = json._class;
			delete json._class;
			json._startingTask= project.findTaskById(json._startingTaskId);
			json._endingTask= project.findTaskById(json._endingTaskId);
			delete json._startingTaskId;
			delete json._endingTaskId;
			return new namespace[_class](json);
		}
	};
	
	return {EndToStart: EndToStartDependency};
});
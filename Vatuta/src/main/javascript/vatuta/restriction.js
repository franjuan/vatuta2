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
			if (task.getId()===this.getEndingTask().getId()) {
				return [this.getStartingTask()];
			} else {
				return [];
			}
		},
		getDependencies4Task: function(task) {
			if (task.getId()===this.getStartingTask().getId()) {
				return [this.getEndingTask()];
			} else {
				return [];
			}
		}
	});
});
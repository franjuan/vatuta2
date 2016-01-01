/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang"], function(declare, lang) {
	/**
     * @exports Restriction
     */
	var PlanningTactic = declare("PlanningTactic", null, {
		/**
		 * To allow this.inherited on constructor
		 */
		"-chains-": {
			constructor: "manual"
		},
		/**
		 * @constructs Restriction
		 */
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		}
	});
	/**
     * @exports PlanningTactics
     */
	var ASAPTactic = declare("ASAPTactic", PlanningTactic, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		name: function() {
			return "ASAP";
		},
		description: function() {
			return "Start task as soon as possible";
		},
		getActualStart4Task: function(task) {
			return task.earlyStart();
		},
		getActualEnd4Task: function(task) {
			return task.earlyEnd();
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor)) {
				return true;
			} else return false; 
		},
		watchHash: function() {
			return this._dependantId + this.shortType();
		},
		shortDescription: function() {
			return "ASAP";
		},
		longDescription: function() {
			return "Start task ASAP";
		},
		type: function() {
			return "ASAP";
		}
	});
	
	return {ASAP: ASAPTactic};
});
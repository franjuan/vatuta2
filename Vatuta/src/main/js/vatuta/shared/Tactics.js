/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "lodash"], function(declare, lang, _) {
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
		shortDescription: function() {
			return "ASAP";
		},
		longDescription: function() {
			return "Start task ASAP";
		}
	});
	
	/**
     * @exports PlanningTactics
     */
	var ALAPTactic = declare("ALAPTactic", PlanningTactic, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		name: function() {
			return "ALAP";
		},
		description: function() {
			return "Start task as late as possible";
		},
		getActualStart4Task: function(task) {
			return task.lateStart();
		},
		getActualEnd4Task: function(task) {
			return task.lateEnd();
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor)) {
				return true;
			} else return false; 
		},
		shortDescription: function() {
			return "ALAP";
		},
		longDescription: function() {
			return "Start task ALAP";
		}
	});
	

	PlanningTactic._tactics = [{name:'ASAP', tactic: new ASAPTactic(), defaultTactic: true},
	                           {name:'ALAP', tactic: new ALAPTactic(), defaultTactic: false}];
	PlanningTactic.getTactics = function() {
		return PlanningTactic._tactics;
	};
	PlanningTactic.getDefaultTactic = function() {
		return _.result(_.find(PlanningTactic._tactics, 'defaultTactic'), 'tactic');
	};
	PlanningTactic.getTacticInstanceByName = function(name) {
		return _.result(_.find(PlanningTactic._tactics, 'name', name), 'tactic');
	};
	PlanningTactic.getTacticConstructorByName = function(name) {
		return PlanningTactic.getTacticInstanceByName(name).__proto__.constructor;
	};
	PlanningTactic.isTactic = function(tactic) {
		return tactic && tactic.isInstanceOf && tactic.isInstanceOf(PlanningTactic);
	};
	return PlanningTactic;
});
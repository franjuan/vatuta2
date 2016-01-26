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
		getPlannedStartInRange4Task: function(task, startRange) {
			return startRange[0];
		},
		getPlannedEndInRange4Task: function(task, endRange) {
			return endRange[0];
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor)) {
				return true;
			} else return false; 
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
		getPlannedStartInRange4Task: function(task, startRange) {
			return startRange[1];
		},
		getPlannedEndInRange4Task: function(task, endRange) {
			return endRange[1];
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor)) {
				return true;
			} else return false; 
		}
	});
	
	/**
     * @exports PlanningTactics
     */
	var ManualTactic = declare("ManualTactic", PlanningTactic, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		name: function() {
			return "Manual";
		},
		description: function() {
			return "Start and end are manually set for task";
		},
		getPlannedStartInRange4Task: function(task, startRange) {
			return task.manualStart();
		},
		getPlannedEndInRange4Task: function(task, endRange) {
			return task.manualEnd();
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor)) {
				return true;
			} else return false; 
		}
	});
	

	PlanningTactic._tactics = [{name:'ASAP', tactic: new ASAPTactic(), defaultTactic: true},
	                           {name:'ALAP', tactic: new ALAPTactic(), defaultTactic: false},
	                           {name:'Manual', tactic: new ManualTactic(), defaultTactic: false}];
	
	PlanningTactic.MANUAL = _.result(_.find(PlanningTactic._tactics, 'name', 'Manual'), 'tactic');
	
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
/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/engine.js", "./vatuta/Duration.js"], function(declare, lang, Engine, Duration) {
	/**
     * @exports Restriction
     */
	var Restriction = declare("Restriction", null, {
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
     * @exports TaskDependencyRestriction
     */
	var TaskDependency = declare("TaskDependency", Restriction, {
		constructor: function(/* Object */kwArgs) {
			if (kwArgs._dependant) {
				kwArgs._dependantId = kwArgs._dependant.id();
				delete kwArgs._dependant;
			}
			if (kwArgs._dependency) {
				kwArgs._dependencyId = kwArgs._dependency.id();
				delete kwArgs._dependency;
			}
			this._delay = new Duration();
			this.inherited(arguments);
			this.dependency().addRestrictionFromDependants(this);
			this.dependant().addRestriction(this);
		},
		dependency: function() {
			return Engine.taskById(this._dependencyId);
		},
		dependant: function() {
			return Engine.taskById(this._dependantId);
		},
		delay: function(newDuration) {
			return arguments.length ? (this._delay = newDuration) : this._delay;
		},
		getDependants4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				return [this.dependant()];
			} else {
				return [];
			}
		},
		getDependencies4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				return [this.dependency()];
			} else {
				return [];
			}
		},
		getMinEarlyStart4Task: function(task) {
			return 0;
		},
		getMinEarlyEnd4Task: function(task) {
			return 0;
		},
		getMaxLateStart4Task: function(task) {
			return Infinity;
		},
		getMaxLateEnd4Task: function(task) {
			return Infinity;
		},
		remove: function() {
			this.dependant().removeRestriction(this);
			this.dependency().removeRestrictionFromDependants(this);
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor) && this._dependantId == other._dependantId && this._dependencyId == other._dependencyId) {
				return true;
			} else return false; 
		},
		watchHash: function() {
			return this._dependencyId + this.shortType() + this._dependantId;
		},
		shortDescription: function() {
			return this.dependency().index()+this.shortType()+(this.delay().isZero()?'':(this.delay().isNegative()?(' - '+this.delay().shortFormatter(true)):(' + '+this.delay().shortFormatter())));
		},
		template: 'TaskDependencyItem.html'
	});
	/**
     * @exports EndToStartDependency
     */
	var EndToStartDependency = declare("EndToStartDependency", TaskDependency, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		getMinEarlyStart4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency().earlyEnd()) {
					return this.delay().addTo(this.dependency().earlyEnd());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMinLateStart4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependant().earlyStart()) {
					return this.dependant().duration().addTo(this.dependant().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependency().lateEnd()) {
					return this.dependency().duration().subtractFrom(this.dependency().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependant().lateStart()) {
					return this.delay().subtractFrom(this.dependant().lateStart());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		dependantDescription: function() {
			return "This task starts " + this.delay().humanize(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " finishes.";
		},
		longDescription: function() {
			return this.type() + " restriction for the task " + this.dependant().index() + ".- " + this.dependant().name() + " that starts " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " finishes.";
		},
		type: function() {
			return "Finish-Start";
		},
		shortType: function() {
			return "FS";
		}
	});
	
	/**
     * @exports StartToEndDependency
     */
	var StartToEndDependency = declare("StartToEndDependency", TaskDependency, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		getMinEarlyEnd4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency().earlyStart()) {
					return this.delay().addTo(this.dependency().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependant().lateEnd()) {
					return this.delay().subtractFrom(this.dependant().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		dependantDescription: function() {
			return "This task starts " + this.delay().humanize(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " finishes.";
		},
		longDescription: function() {
			return this.type() + " restriction for the task " + this.dependant().index() + ".- " + this.dependant().name() + " that starts " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " finishes.";
		},
		type: function() {
			return "Finish-Start";
		},
		shortType: function() {
			return "FS";
		}
	});
	
	/**
     * @exports StartToStartDependency
     */
	var StartToStartDependency = declare("StartToStartDependency", TaskDependency, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		getMinEarlyStart4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency().earlyStart()) {
					return this.delay().addTo(this.dependency().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependant().earlyStart()) {
					return this.dependant().duration().addTo(this.dependant().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependant().lateStart()) {
					return this.delay().subtractFrom(this.dependant().lateStart());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependency().lateStart()) {
					return this.dependency().duration().addTo(this.dependency().lateStart());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		dependantDescription: function() {
			return "This task starts " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " starts.";
		},
		longDescription: function() {
			return this.type() + " restriction for the task " + this.dependant().index() + ".- " + this.dependant().name() + " that starts " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " starts.";
		},
		type: function() {
			return "Start-Start";
		},
		shortType: function() {
			return "SS";
		}
	});
	
	/**
     * @exports StartToStartDependency
     */
	var EndToEndDependency = declare("EndToEndDependency", TaskDependency, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		getMinEarlyStart4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependant().earlyEnd()) {
					return this.dependant().duration().subtractFrom(this.dependant().earlyEnd());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency().earlyEnd()) {
					return this.delay().addTo(this.dependency().earlyEnd());
				} else {
					return NaN;
				}
			} else {
				return 0;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependency().lateEnd()) {
					return this.dependency().duration().subtractFrom(this.dependency().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				if (this.dependant().lateEnd()) {
					return this.delay().subtractFrom(this.dependant().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		dependantDescription: function() {
			return "This task ends " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " ends.";
		},
		longDescription: function() {
			return this.type() + " restriction for the task " + this.dependant().index() + ".- " + this.dependant().name() + " that ends " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " ends.";
		},
		type: function() {
			return "End-End";
		},
		shortType: function() {
			return "EE";
		}
	});
	
	/**
     * @exports PlanningCriteria
     */
	var TaskDependency = declare("PlanningCriteria", Restriction, {
		constructor: function(/* Object */kwArgs) {
			if (kwArgs._dependant) {
				kwArgs._dependantId = kwArgs._dependant.id();
				delete kwArgs._dependant;
			}
			this.inherited(arguments);
			this.dependant().addRestriction(this);
		},
		dependant: function() {
			return Engine.taskById(this._dependantId);
		},
		getDependants4Task: function(task) {
			if (!task || task.id()===this.dependency().id()) {
				return [this.dependant()];
			} else {
				return [];
			}
		},
		getActualStart4Task: function(task) {
			return 0;
		},
		getActualEnd4Task: function(task) {
			return 0;
		},
		remove: function() {
			this.dependant().removeRestriction(this);
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor) && this._dependantId == other._dependantId) {
				return true;
			} else return false; 
		},
		watchHash: function() {
			return this._dependantId + this.shortType();
		},
		shortDescription: function() {
			return "Start task ASAP";
		},
		template: 'PlanningCriteriaItem.html'
	});
	
	return {EndToStart: EndToStartDependency, StartToEnd: StartToEndDependency, StartToStart: StartToStartDependency, EndToEnd: EndToEndDependency};
});
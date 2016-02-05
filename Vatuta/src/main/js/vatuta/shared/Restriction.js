/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "vatuta/shared/Engine", "vatuta/shared/Duration", "moment"], function(declare, lang, Engine, Duration, moment) {
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
			return Infinity;
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
			if (task.equals(this.dependant()) || task.isDescendantOf(this.dependant())) {
				if (this.dependency().earlyEnd()) {
					return this.delay().addTo(this.dependency().earlyEnd());
				} else {
					return NaN;
				}
			} else {
				return -Infinity;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (task.equals(this.dependant()) || task.isDescendantOf(this.dependant())) {
				if (this.dependency().earlyEnd() && this.dependant().duration()) {
					return this.dependant().duration().addTo(this.delay().addTo(this.dependency().earlyEnd()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (task.equals(this.dependency()) || task.isDescendantOf(this.dependency())) {
				if (this.dependant().lateStart() && this.dependency().duration()) {
					return this.dependency().duration().subtractFrom(this.delay().subtractFrom(this.dependant().lateStart()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (task.equals(this.dependency()) || task.isDescendantOf(this.dependency())) {
				if (this.dependant().lateStart()) {
					return this.delay().subtractFrom(this.dependant().lateStart());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
//		onStart: function(task) {
//			if (task.id()===this.dependency().id()) {
//				return false;
//			} else {
//				return true;
//			}
//		},
//		onFinish: function(task) {
//			if (task.id()===this.dependency().id()) {
//				return true;
//			} else {
//				return false;
//			}
//		},
		restrictPlannedStartRange: function(task, plannedStartRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualEndCalculated) {
					return [moment.max(plannedStartRange[0], this.delay().addTo(this.dependency().actualEnd())),
					        plannedStartRange[1]];
				} else {
					return false;
				}
			} else return plannedStartRange;
		},
		restrictPlannedEndRange: function(task, plannedEndRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualEndCalculated) {
					return plannedEndRange;
				} else {
					return false;
				}
			} else return plannedEndRange;
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
		getMinEarlyStart4Task: function(task) {
			if (task.equals(this.dependant())) {
				if (this.dependency().earlyStart() && this.dependant().duration()) {
					return this.dependant().duration().subtractFrom(this.delay().addTo(this.dependency().earlyStart()));
				} else {
					return NaN;
				}
			} else {
				return -Infinity;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (task.equals(this.dependant())) {
				if (this.dependency().earlyStart()) {
					return this.delay().addTo(this.dependency().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (task.equals(this.dependency())) {
				if (this.dependant().lateEnd()) {
					return this.delay().subtractFrom(this.dependant().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (task.equals(this.dependency())) {
				if (this.dependant().lateEnd() && this.dependency().duration()) {
					return this.dependency().duration().addTo(this.delay().subtractFrom(this.dependant().lateEnd()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
//		onStart: function(task) {
//			if (task.id()===this.dependency().id()) {
//				return true;
//			} else {
//				return false;
//			}
//		},
//		onFinish: function(task) {
//			if (task.id()===this.dependency().id()) {
//				return false;
//			} else {
//				return true;
//			}
//		},
		restrictPlannedStartRange: function(task, plannedStartRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualStartCalculated) {
					return plannedStartRange;
				} else {
					return false;
				}
			} else return plannedStartRange;
		},
		restrictPlannedEndRange: function(task, plannedEndRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualStartCalculated) {
					return [moment.max(plannedEndRange[0], this.delay().addTo(this.dependency().actualStart())),
					        plannedEndRange[1]];
				} else {
					return false;
				}
			} else return plannedEndRange;
			
		},
		dependantDescription: function() {
			return "This task finishes " + this.delay().humanize(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " starts.";
		},
		longDescription: function() {
			return this.type() + " restriction for the task " + this.dependant().index() + ".- " + this.dependant().name() + " that finishes " + this.delay().toString(true) + " " + this.dependency().index() + ".- " + this.dependency().name()+ " starts.";
		},
		type: function() {
			return "Start-Finish";
		},
		shortType: function() {
			return "SF";
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
			if (task.equals(this.dependant()) || task.isDescendantOf(this.dependant())) {
				if (this.dependency().earlyStart()) {
					return this.delay().addTo(this.dependency().earlyStart());
				} else {
					return NaN;
				}
			} else {
				return -Infinity;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (task.equals(this.dependant()) || task.isDescendantOf(this.dependant())) {
				if (this.dependency().earlyStart() && this.dependant().duration()) {
					return this.dependant().duration().addTo(this.delay().addTo(this.dependency().earlyStart()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (task.equals(this.dependency()) || task.isDescendantOf(this.dependency())) {
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
			if (task.equals(this.dependency()) || task.isDescendantOf(this.dependency())) {
				if (this.dependant().lateStart() && this.dependency().duration()) {
					return this.dependency().duration().addTo(this.delay().subtractFrom(this.dependant().lateStart()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
//		onStart: function(task) {
//			return true;
//		},
//		onFinish: function(task) {
//			return false;
//		},
		restrictPlannedStartRange: function(task, plannedStartRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualStartCalculated) {
					return [moment.max(plannedStartRange[0], this.delay().addTo(this.dependency().actualStart())),
					        plannedStartRange[1]];
				} else {
					return false;
				}
			} else return plannedStartRange;
		},
		restrictPlannedEndRange: function(task, plannedEndRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualStartCalculated) {
					return plannedEndRange;
				} else {
					return false;
				}
			} else return plannedEndRange;
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
     * @exports EndToEndDependency
     */
	var EndToEndDependency = declare("EndToEndDependency", TaskDependency, {
		constructor: function(/* Object */kwArgs) {
			this.inherited(arguments);
		},
		getMinEarlyStart4Task: function(task) {
			if (task.equals(this.dependant())) {
				if (this.dependency().earlyEnd() && this.dependant().duration()) {
					return this.dependant().duration().subtractFrom(this.delay().addTo(this.dependency().earlyEnd()));
				} else {
					return NaN;
				}
			} else {
				return -Infinity;
			}
		},
		getMinEarlyEnd4Task: function(task) {
			if (task.equals(this.dependant())) {
				if (this.dependency().earlyEnd()) {
					return this.delay().addTo(this.dependency().earlyEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateStart4Task: function(task) {
			if (task.equals(this.dependency())) {
				if (this.dependant().lateEnd() && this.dependency().duration()) {
					return this.dependency().duration().subtractFrom(this.delay().subtractFrom(this.dependant().lateEnd()));
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
		getMaxLateEnd4Task: function(task) {
			if (task.equals(this.dependency())) {
				if (this.dependant().lateEnd()) {
					return this.delay().subtractFrom(this.dependant().lateEnd());
				} else {
					return NaN;
				}
			} else {
				return Infinity;
			}
		},
//		onStart: function(task) {
//			return false;
//		},
//		onFinish: function(task) {
//			return true;
//		},
		restrictPlannedStartRange: function(task, plannedStartRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualEndCalculated) {
					return plannedStartRange;
				} else {
					return false;
				}
			} else return plannedStartRange;
		},
		restrictPlannedEndRange: function(task, plannedEndRange) {
			if (!task || task.id()===this.dependant().id()) {
				if (this.dependency()._$actualEndCalculated) {
					return [moment.max(plannedEndRange[0], this.delay().addTo(this.dependency().actualEnd())),
					        plannedEndRange[1]];
				} else {
					return false;
				}
			} else return plannedEndRange;
			
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
	
	return {EndToStart: EndToStartDependency, StartToEnd: StartToEndDependency, StartToStart: StartToStartDependency, EndToEnd: EndToEndDependency};
});
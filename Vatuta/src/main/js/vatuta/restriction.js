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
     * @exports Restriction
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
		remove: function() {
			this.dependant().removeRestriction(this);
			this.dependency().removeRestrictionFromDependants(this);
		},
		equals: function(other) {
			if (other.isInstanceOf && other.isInstanceOf(this.constructor) && this._dependantId == other._dependantId && this._dependencyId == other._dependencyId) {
				return true;
			} else return false; 
		}
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
		getMinEarlyEnd4Task: function(task) {
			return 0;
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
		getMaxLateEnd4Task: function(task) {
			return Infinity;
		},
		template: 'EndToStartDependencyItem.html',
		watchHash: function() {
			return this._dependencyId + 'FS' + this._dependantId;
		},
		shortDescription: function() {
			return this.dependency().index()+'FS'+(this.delay().isZero()?'':(' + '+this.delay().shortFormatter()));
		},
		longDescription: function() {
			return this.type() + " restriction between the task " + this.dependant().index() + ".- " + this.dependant().name() + " that starts when " + this.dependency().index() + ".- " + this.dependency().name()+ " finishes.";
		},
		type: function() {
			return "Finish-Start";
		}
	});
	
	return {EndToStart: EndToStartDependency};
});
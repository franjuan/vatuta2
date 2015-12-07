define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "./vatuta/Duration.js", "./vatuta/tactics.js" ], function(declare,
		lang, _, moment, DurationUtils, Tactics) {
	return declare("baseTask", null, {
		/**
		 * To allow this.inherited on constructor
		 */
		"-chains-": {
			constructor: "manual"
		},
		constructor : function (/* Object */kwArgs) {
			if (this._earlyStart && !moment.isMoment(this._earlyStart)) {
				this._earlyStart = moment(this._earlyStart);
			}
			if (this._earlyEnd && !moment.isMoment(this._earlyEnd)) {
				this._earlyEnd = moment(this._earlyEnd);
			}
			if (this._lateStart && !moment.isMoment(this._lateStart)) {
				this._lateStart = moment(this._lateStart);
			}
			if (this._lateEnd && !moment.isMoment(this._lateEnd)) {
				this._lateEnd = moment(this._lateEnd);
			}
			lang.mixin(this, kwArgs);
			if (!this._id) {
				this._id='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				    return v.toString(16);
				});
			}
			if (!this._tactic) {
				this._tactic = new Tactics.ASAP();
			}
		},
		remove: function() {
			// Hay que hacerlo así porque el remove lo quita de la misma lista
			while(this.restrictions().length >0) {
				this.restrictions()[0].remove();
			};
			while(this.restrictionsFromDependants().length >0) {
				this.restrictionsFromDependants()[0].remove();
			};
		},
		index: function(newIndex) {
		     return arguments.length ? (this._index = newIndex) : this._index;
		},
		id: function(newId) {
		     return arguments.length ? (this._id = newId) : this._id;
		},
		parent: function(newParent) {
		     return arguments.length ? (this._parent = newParent) : this._parent;
		},
		name: function(newName) {
		     return arguments.length ? (this._name = newName) : this._name;
		},
		description: function(newDescription) {
		     return arguments.length ? (this._description = newDescription) : this._description;
		},
		tactic: function(newTactic) {
			return arguments.length ? (this._tactic = newTactic) : this._tactic;
		},
		restrictions : function() {
			if (!this._restrictions) {
				this._restrictions = [];
			}
			return this._restrictions;
		},
		restrictionsFromDependants : function() {
			if (!this._restrictionsFromDependants) {
				this._restrictionsFromDependants = [];
			}
			return this._restrictionsFromDependants;
		},
//		getConstraintsOnTask: function(f, constraints) {
//			if (!constraints) {
//				var constraints = [];
//			}
//			_.forEach([this.restrictions(), this.restrictionsFromDependants()], function(restrictions) {
//				_.forEach(restrictions, function(restriction) {
//					constraints.push(_.bind(restriction[f], restriction, this));
//				}, this);
//			}, this);
//			if (this.parent().getConstraintsOnTask) {
//				this.parent().getConstraintsOnTask(f, constraints);
//			}
//			return constraints;
//		},
		addRestriction : function(restriction) {
			this.restrictions().push(restriction);
			this._dependencies = null;
			return restriction;
		},
		addRestrictionFromDependants : function(restriction) {
			this.restrictionsFromDependants().push(restriction);
			this._dependants = null;
			return restriction;
		},
		removeRestriction: function (restriction) {
			_.remove(this._restrictions, function(n) {return this.equals(n)}, restriction);
			this._dependencies = null;
		},
		removeRestrictionFromDependants: function (restriction) {
			_.remove(this._restrictionsFromDependants, function(n) {return this.equals(n)}, restriction);
			this._dependants = null;
		},
		getDependencies : function() {
			if (!this._dependencies) {
				this._dependencies = [];
				_.forEach(this.restrictions(), function(restriction) {
					_.forEach(restriction.getDependencies4Task(this), function(dependency) {
						this._dependencies.push(dependency);
					}, this);
				}, this);
			}
			return this._dependencies;
		},
		getDependants : function() {
			if (!this._dependants) {
				this._dependants = [];
				_.forEach(this.restrictionsFromDependants(), function(restriction) {
					_.forEach(restriction.getDependants4Task(this), function(dependant) {
						this._dependants.push(dependant);
					}, this);
				}, this);
			}
			return this._dependants;
		},
		earlyStart: function(newEarlyStart) {
			return arguments.length ? this._earlyStart = newEarlyStart : this._earlyStart;
		},
		earlyEnd: function(newEarlyEnd) {
			return arguments.length ? this._earlyEnd = newEarlyEnd : this._earlyEnd;
		},
		lateStart: function(newLateStart) {
			return arguments.length ? this._lateStart = newLateStart : this._lateStart;
		},
		lateEnd: function(newLateEnd) {
			return arguments.length ? this._lateEnd = newLateEnd : this._lateEnd;
		},
		actualStart: function(newActualStart) {
			return arguments.length ? this._actualStart = newActualStart : this._actualStart;
		},
		actualEnd: function(newActualEnd) {
			return arguments.length ? this._actualEnd = newActualEnd : this._actualEnd;
		},
		actualDuration: function(newActualDuration) {
			return arguments.length ? this._actualDuration = newActualDuration : this._actualDuration;
		},
		hasFixedDuration: function() {
			return this.duration;
		}
	});
});
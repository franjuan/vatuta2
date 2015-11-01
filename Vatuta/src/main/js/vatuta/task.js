define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment" ], function(declare,
		lang, _, moment) {
	return declare("Task", null, {
		constructor : function (/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
			if (!this._id) {
				this._id='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				    return v.toString(16);
				});
			}
		},
		index: function(newIndex) {
		     return arguments.length ? (this._index = newIndex) : this._index;
		},
		id: function(newId) {
		     return arguments.length ? (this._id = newId) : this._id;
		},
		name: function(newName) {
		     return arguments.length ? (this._name = newName) : this._name;
		},
		description: function(newDescription) {
		     return arguments.length ? (this._description = newDescription) : this._description;
		},
		duration: function(newDuration) {
		     return arguments.length ? (this._duration = newDuration) : this._duration;
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
		addRestriction : function(restriction) {
			this.restrictions().push(restriction);
			this._dependencies = null;
			this._dependants = null;
			return restriction;
		},
		addRestrictionFromDependants : function(restriction) {
			this.restrictionsFromDependants().push(restriction);
			this._dependencies = null;
			this._dependants = null;
			return restriction;
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
			return arguments.length ? (this._earlyStart = newEarlyStart.toDate()) : this._earlyStart?moment(this._earlyStart):null;
		},
		earlyEnd: function(newEarlyEnd) {
			return arguments.length ? (this._earlyEnd = newEarlyEnd.toDate()) : this._earlyEnd?moment(this._earlyEnd):null;
		},
		lateStart: function(newLateStart) {
			return arguments.length ? (this._lateStart = newLateStart.toDate()) : this._lateStart?moment(this._lateStart):null;
		},
		lateEnd: function(newLateEnd) {
			return arguments.length ? (this._lateEnd = newLateEnd.toDate()) : this._lateEnd?moment(this._lateEnd):null;
		},
		watchHash: function() {
			return this.id() + this.index() + this.name() + this.description() + this.duration() +
				_.reduce(
						_.map(this.restrictions(), function(restriction) {
														return restriction.watchHash();
													}), function(total, value) {
															return total + value;
														}
						);
		}
	});
});
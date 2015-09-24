define([ "dojo/_base/declare", "dojo/_base/lang", "lodash" ], function(declare,
		lang, _) {
	return declare(null, {
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		},
		getId : function() {
			return this._id;
		},
		getDuration : function() {
			return this._duration;
		},
		getRestrictions : function() {
			if (!this._restrictions) {
				this._restrictions = [];
			}
			return this._restrictions;
		},
		addRestriction : function(restriction) {
			this.getRestrictions().push(restriction);
			this._dependencies = null;
			this._dependants = null;
			return restriction;
		},
		getDependencies : function() {
			if (!this._dependencies) {
				this._dependencies = [];
				_.forEach(this.getRestrictions(), function(restriction) {
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
				_.forEach(this.getRestrictions(), function(restriction) {
					_.forEach(restriction.getDependants4Task(this), function(dependant) {
						this._dependants.push(dependant);
					}, this);
				}, this);
			}
			return this._dependants;
		},
		getEarlyStart: function() {
			return this._earlyStart;
		},
		getEarlyEnd: function() {
			return this._earlyEnd;
		},
		getLateStart: function() {
			return this._lateStart;
		},
		getLateEnd: function() {
			return this._lateEnd;
		}
	});
});
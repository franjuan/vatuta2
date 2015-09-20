define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	return declare(null, {
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
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
			restriction.enable();
		},
		getDependencies: function() {
			if (!this._dependencies) {
				this._dependencies = [];
			}
			return this._dependencies;
		},
		addDependency : function(task) {
			this.getDependencies().push(task);
		},
		getDependants: function() {
			if (!this._dependants) {
				this._dependants = [];
			}
			return this._dependants;
		},
		addDependant : function(task) {
			this.getDependants().push(task);
		}
	});
});
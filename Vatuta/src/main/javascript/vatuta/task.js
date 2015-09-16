define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	return declare(null, {
		constructor : function(/* Object */kwArgs) {
			this._restrictions = [];
			lang.mixin(this, kwArgs);
		},
		getRestrictions : function() {
			return this._restrictions;
		},
		getDuration : function() {
			return this._duration;
		}
	});
});
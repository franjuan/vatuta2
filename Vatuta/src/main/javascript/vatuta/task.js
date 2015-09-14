define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	return declare(null, {
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		},
		getDuration : function() {
			return this.duration;
		}
	});
});
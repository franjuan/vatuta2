define([ "dojo/_base/declare", "dojo/_base/lang", "lodash", "moment", "./vatuta/Duration.js", "./vatuta/baseTask.js" ], function(declare,
		lang, _, moment, DurationUtils, baseTask) {
	return declare("Task", baseTask, {
		constructor : function (/* Object */kwArgs) {
			this.inherited(arguments);
		},
		duration: function(newDuration) {
		     return arguments.length ? (this._duration = newDuration) : this._duration;
		},
		watchHash: function() {
			return this.id() + this.index() + this.name() + this.description() + this.duration().shortFormatter() +
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
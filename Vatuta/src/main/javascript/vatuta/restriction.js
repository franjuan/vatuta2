/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	/**
     * @exports Restriction
     */
	var Restriction = declare("Vatuta.Restriction", null, {
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
	var EndToStartDependency = declare("Vatuta.EndToStartDependency", Restriction, {
		getEndingTask: function() {
			return this._endingTask;
		},
		getStartingTask: function() {
			return this._startingTask;
		}
	});
});
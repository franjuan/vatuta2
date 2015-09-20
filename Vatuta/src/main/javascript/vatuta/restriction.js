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
			this._enabled = false;
			lang.mixin(this, kwArgs);
		},
		enable: function() {
			this._enabled = true;
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
		},
		enable: function() {
			this.inherited(arguments);
			this.getEndingTask().addDependant(this._startingTask);
			this.getStartingTask().addDependency(this.endingtask);
		}
	});
});
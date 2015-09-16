/**
 * @module Restriction
 */
define([ "dojo/_base/declare", "dojo/_base/lang" ], function(declare, lang) {
	/**
     * @exports Restriction
     */
	return declare("Restriction", null, {
		/**
		 * @constructs Restriction
		 */
		constructor : function(/* Object */kwArgs) {
			lang.mixin(this, kwArgs);
		}
	});
});
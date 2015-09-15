/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js", "./vatuta/engine.js" ],
		function(declare, lang, Task, Engine) {
			/**
		     * @exports Project
		     */
			return declare(null, {
				/**
				 * @constructs Project
				 */
				constructor : function(/* Object */kwArgs) {
					lang.mixin(this, kwArgs);
				},
				/**
				 * @function
				 * @memberof Project
				 */
				getHello : function() {
					this.task = new Task({
						duration : 3
					});
					return '<em> Dojo!' + Engine.calculateEarlyStartLateEnding() + '</em>';
				}
			});
		});
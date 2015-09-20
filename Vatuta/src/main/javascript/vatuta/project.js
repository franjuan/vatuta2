/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js", "./vatuta/engine.js" ],
		function(declare, lang, Task, Engine) {
			/**
		     * @exports Project
		     */
			return declare("Project", null, {
				/**
				 * @constructs Project
				 */
				constructor : function(/* Object */kwArgs) {
					this._tasks = [];
					lang.mixin(this, kwArgs);
				},
				/**
				 * @function
				 * @memberof Project
				 */
				getTasks : function() {
					return this._tasks;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				addTask : function(task) {
					this._tasks.push(task);
					return task;
				}
			});
		});
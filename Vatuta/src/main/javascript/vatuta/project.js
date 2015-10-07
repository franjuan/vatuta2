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
				},
				/**
				 * @function
				 * @memberof Project
				 */
				name: function(newName) {
				     return arguments.length ? (this._name = newName) : this._name;
				},
				
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedStart: function(newStart) {
				     return arguments.length ? (this._start = newStart) : this._start;
				},
				
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedEnd: function(newEnd) {
				     return arguments.length ? (this._end = newEnd) : this._end;
				},
				
				calculatedLength: function() {
					return this.calculatedEnd() - this.calculatedStart();
				}

			});
		});
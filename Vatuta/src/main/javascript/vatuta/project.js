/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js", "./vatuta/engine.js", "lodash" ],
		function(declare, lang, Task, Engine, _) {
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
					this.getTasks().push(task);
					task.index(this.getTasks().length);
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
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedLength: function() {
					return this.calculatedEnd() - this.calculatedStart();
				},
				/**
				 * @function
				 * @memberof Project
				 */
				findTaskById: function(id) {
					for (i = 0; i < this.getTasks().length; i++) {
						if (this.getTasks()[i].id()==id) {
							return this.getTasks()[i];
						}
					};
					return null;
				}
			});
		});
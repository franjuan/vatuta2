/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js", "./vatuta/engine.js", "lodash", "moment" ],
		function(declare, lang, Task, Engine, _, moment) {
			/**
		     * @exports Project
		     */
			return declare("Project", null, {
				/**
				 * @constructs Project
				 */
				constructor : function(/* Object */kwArgs) {
					this._tasks = [];
					this._start = moment();
					lang.mixin(this, kwArgs);
				},
				/**
				 * @function
				 * @memberof Project
				 */
				getTasks : function() {
					return this._tasks;
				},
				_tasksIndex: function() {
					if (!this._$taskIndex) {
						this._$taskIndex = {};
						for (var i = 0; i < this.getTasks().length; i++) {
							this._$taskIndex[this.getTasks()[i].id()] = this.getTasks()[i];
						};
					}
					return this._$taskIndex;
				}
				,
				/**
				 * @function
				 * @memberof Project
				 */
				addTask : function(task) {
					this.getTasks().push(task);
					this._tasksIndex()[task.id()] = task;
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
				start: function(newStart) {
				     return arguments.length ? (this._start = newStart) : this._start;
				},
				
				/**
				 * @function
				 * @memberof Project
				 */
				end: function(newEnd) {
				     return arguments.length ? (this._end = newEnd) : this._end;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedLength: function() {
					return this.end() - this.start();
				},
				/**
				 * @function
				 * @memberof Project
				 */
				findTaskById: function(id) {
					return this._tasksIndex()[id];
				}
			});
		});
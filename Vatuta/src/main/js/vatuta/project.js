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
					this.start(moment());
					lang.mixin(this, kwArgs);
				},
				/**
				 * @function
				 * @memberof Project
				 */
				tasks : function() {
					return this._tasks;
				},
				_tasksIndex: function() {
					if (!this._$taskIndex) {
						this._$taskIndex = {};
						for (var i = 0; i < this.tasks().length; i++) {
							this._$taskIndex[this.tasks()[i].id()] = this.tasks()[i];
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
					this.tasks().push(task);
					this._tasksIndex()[task.id()] = task;
					task.index(this.tasks().length);
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
					return moment.duration(this.end().diff(this.start()));
				},
				/**
				 * @function
				 * @memberof Project
				 */
				findTaskById: function(id) {
					return this._tasksIndex()[id];
				},
				removeTask: function(task) {
					task.remove();
					// Remove task from project
					_.remove(this.tasks(), "_id", task.id());
					// Remove index
					delete this._tasksIndex()[task.id()];
					// Update ordinal indexes
					for (var i = task.index() - 1; i < this.tasks().length; i++) { 
					    this.tasks()[i].index(i + 1);
					}
				}
			});
		});
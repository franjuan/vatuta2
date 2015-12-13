/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "vatuta/task", "vatuta/engine", "lodash", "moment" ],
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
					this.earlyStart(moment());
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
					if (!task.parent())	task.parent(this);
					return task;
				},
				removeTask: function(task) {
					// Remove task from project
					_.remove(this.tasks(), "_id", task.id());
					// Remove index
					delete this._tasksIndex()[task.id()];
					// Update ordinal indexes
					for (var i = task.index() - 1; i < this.tasks().length; i++) { 
					    this.tasks()[i].index(i + 1);
					}
					if (task.children()) {
						_.forEach(task.children(), function(child) {
							this.removeTask(child);
						}, this);
					}
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
				earlyStart: function(newEarlyStart) {
					return arguments.length ? this._earlyStart = newEarlyStart : this._earlyStart;
				},
				earlyEnd: function(newEarlyEnd) {
					return arguments.length ? this._lateEnd = newEarlyEnd : this._lateEnd;
				},
				lateStart: function(newLateStart) {
					return arguments.length ? this._earlyStart = newLateStart : this._earlyStart;
				},
				lateEnd: function(newLateEnd) {
					return arguments.length ? this._lateEnd = newLateEnd : this._lateEnd;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				actualStart: function(newActualStart) {
					return arguments.length ? this._actualStart = newActualStart : this._actualStart;
				}
				/**
				 * @function
				 * @memberof Project
				 */
				,
				actualEnd: function(newActualEnd) {
					return arguments.length ? this._actualEnd = newActualEnd : this._actualEnd;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				actualDuration: function() {
					return moment.duration(this.actualEnd().diff(this.actualStart()));
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
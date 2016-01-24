/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "vatuta/shared/Task", "lodash", "moment" ],
		function(declare, lang, Task, _, moment) {
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
				addTask : function(task, parent) {
					if (!parent)	{
						task.parent(this);
					} else {
						parent.addTask(task);
					}
					this.tasks().push(task);
					this._tasksIndex()[task.id()] = task;
					this.setViewIndexes();
					return task;
				},
				// TODO take out index from here, is part of the view or representation of the project. Tasks are not ordered in project
				setViewIndexes: function() {
					var index = 1;
					_.forEach(this.tasks(), function(task) {
						// Only set index to direct children, index of task own by other parent will be set with parent's index
						if (task.parent().isInstanceOf(Project)) {
							index = task.setViewIndexes(index, 0);
							index++;
						}
					}, this);
				},
				removeTask: function(task) {
					task.remove();
					// Remove task from project
					_.remove(this.tasks(), "_id", task.id());
					// Remove index
					delete this._tasksIndex()[task.id()];
					if (!task.parent().isInstanceOf(Project)){
						task.parent().removeTask(task);
					}
					if (task.children) {
						_.forEach(task.children(), function(child) {
							this.removeTask(child);
						}, this);
					}
					// Update ordinal indexes
					this.setViewIndexes();
				},
				replaceTask: function(task) {
					 // Find element in project
					 var index = _.findIndex(this.tasks(), "_id", task.id());
					 this.tasks()[index] = task;
					 this._tasksIndex()[task.id()] = task;
					 if (!task.parent().isInstanceOf(Project)) {
						 task.parent().replaceTask(task);
					 }
					 this.setViewIndexes();
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
				},
				iterateDepthForProperty: function(property) {
					return this[property]();
				}
			});
		});
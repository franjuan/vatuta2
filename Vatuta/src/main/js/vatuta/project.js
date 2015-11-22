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
					this.baseStart(moment());
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
				baseStart: function(newStart) {
					return arguments.length ? (this._baseStart = newStart) : this._baseStart;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedStart: function(newEnd) {
					return arguments.length ? (this._calculatedStart= newEnd) : this._calculatedStart;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedEnd: function(newEnd) {
					return arguments.length ? (this._calculatedEnd = newEnd) : this._calculatedEnd;
				},
				/**
				 * @function
				 * @memberof Project
				 */
				calculatedLength: function() {
					return moment.duration(this.calculatedEnd().diff(this.calculatedStart()));
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
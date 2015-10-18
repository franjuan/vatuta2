/**
 * @module Project
 */
define([ "dojo/_base/declare", "dojo/_base/lang", "./vatuta/task.js", "./vatuta/engine.js", "lodash" ],
		function(declare, lang, Task, Engine, _) {
			/**
		     * @exports Project
		     */
			var Project = declare("Project", null, {
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
					for (var i = 0; i < this.getTasks().length; i++) {
						if (this.getTasks()[i].id()==id) {
							return this.getTasks()[i];
						}
					};
					return null;
				},
				jsonify: function () {
					var o = {_name: this._name, _class: this.__proto__.declaredClass, _tasks: []};
					for (var i = 0; i < this.getTasks().length; i++) {
						o._tasks.push(this.getTasks()[i].jsonify());
					};
					return o;
				},
				prepareAfterLoading: function(namespace) {
					for (var i = 0; i < this.getTasks().length; i++) {
						this.getTasks()[i].prepareAfterLoading(this, namespace);
					};
				}
			});
			Project.objectify = function(json, namespace) {
				var _class = json._class;
				delete json._class;
				var project = new namespace[_class](json);
				project._tasks = [];
				if (json._tasks && Array.isArray(json._tasks)) {
					for (var i = 0; i < json._tasks.length; i++) {
						var task = json._tasks[i];
						var _class = task._class;
						project._tasks.push(eval(_class + '.objectify(task, project, namespace)'));
					};
				}
				project.prepareAfterLoading(namespace);
				return project;
			};
			return Project;
		});
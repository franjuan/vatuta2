/**
 * @module Engine
 */
define(
		[ "lodash", "moment" ],
		function(_, moment) {
			/**
			 * @constructor
			 * @alias module:Engine
			 */
			return {
				/**
				 * Get the current project the Engine is working with
				 * @returns {Project}
				 *//**
				 * Set the current project the Engine is working with
				 * @param {Project} new project to be linked to Engine
				 * @returns {Project}
				 */
				currentProject: function(newProject) {
					return arguments.length ? (this._project = newProject) : this._project;
				},
				/**
				 * Find task in current project by its id
				 * @param {id} task id
				 * @returns {Task}
				 * @function
				 * 
				 */
				taskById: function(id) {
					return this._project.findTaskById(id);
				},
				/**
				 * Calculate early start and late end dates of every task of the
				 * project
				 * 
				 * @function
				 * 
				 */
				calculateEarlyStartLateEnding : function() {
					// Remove old values
					delete this._project._end;
					_.forEach(this._project.getTasks(), function(task) {
						delete task._earlyStart;
						delete task._earlyEnd;
						delete task._lateStart;
						delete task._lateEnd;
					});
					
					// We clone the tasks array
					var tasks = _.clone(this._project.getTasks());

					// Calculate early start and ending
					var alreadyCalculatedIndex = -1;
					var endOfProject = this._project.start();
					while (alreadyCalculatedIndex < tasks.length - 1) {
						for (i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							var earlyStart = this._project.start();
							_.forEach(task.restrictions(), function(restriction) {
								earlyStart = moment.max(earlyStart, restriction.getEarlyStart(this));
							}, task);
							_.forEach(task.restrictionsFromDependants(), function(restriction) {
								earlyStart = moment.max(earlyStart, restriction.getEarlyStart(this));
							}, task);
							if (!isNaN(earlyStart)) {
								task._earlyStart = earlyStart;
								task._earlyEnd = earlyStart.add(task.duration(),'days');
								endOfProject = moment.max(endOfProject, task._earlyEnd);
								
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex++;
							}
						}
					}
					
					// Calculate late start and ending
					alreadyCalculatedIndex = tasks.length;
					while (alreadyCalculatedIndex > 0) {
						for (i = alreadyCalculatedIndex - 1; i >= 0; i--) {
							var task = tasks[i];
							var lateEnd = endOfProject;
							_.forEach(task.restrictions(), function(restriction) {
								lateEnd = moment.min(lateEnd, restriction.getLateEnd(this));
							}, task);
							_.forEach(task.restrictionsFromDependants(), function(restriction) {
								lateEnd = moment.min(lateEnd, restriction.getLateEnd(this));
							}, task);
							if (!isNaN(lateEnd)) {
								task._lateEnd = lateEnd;
								task._lateStart = lateEnd.subtract(task.duration(), "days");
								
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex+1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex--;
							}
						}
					}
					
					this._project.end(endOfProject);
				}
			};
		});
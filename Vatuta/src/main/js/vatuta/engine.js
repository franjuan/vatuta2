/**
 * @module Engine
 */
define(
		[ "lodash" ],
		function(_) {
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
					// We clone the tasks array
					var tasks = _.clone(this._project.getTasks());

					// Calculate early start and ending
					var alreadyCalculatedIndex = -1;
					var endOfProject = 0;
					while (alreadyCalculatedIndex < tasks.length - 1) {
						for (i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							var earlyStart = 0;
							_.forEach(task.getRestrictions(), function(restriction) {
								earlyStart = Math.max(earlyStart, restriction.getEarlyStart(this));
							}, task);
							if (!isNaN(earlyStart)) {
								task._earlyStart = earlyStart;
								task._earlyEnd = earlyStart + task.duration();
								endOfProject = Math.max(endOfProject, task._earlyEnd);
								
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
							_.forEach(task.getRestrictions(), function(restriction) {
								lateEnd = Math.min(lateEnd, restriction.getLateEnd(this));
							}, task);
							if (!isNaN(lateEnd)) {
								task._lateEnd = lateEnd;
								task._lateStart = lateEnd - task.duration();
								
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex+1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex--;
							}
						}
					}
					
					this._project.calculatedStart(0);
					this._project.calculatedEnd(endOfProject);
				}
			};
		});
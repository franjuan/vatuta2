/**
 * @module Engine
 */
define(
		[ "dojo/_base/declare", "./vatuta/project.js", "lodash" ],
		function(declare, Project, _) {
			/**
			 * @constructor
			 * @alias module:Engine
			 */
			return {
				/**
				 * Calculate early start and late end dates of every task of the
				 * project
				 * 
				 * @function
				 * @param {Project}
				 *            project Project to be calculated
				 */
				calculateEarlyStartLateEnding : function(project) {
					// We clone the tasks array
					var tasks = _.clone(project.getTasks());

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
								task._earlyEnd = earlyStart + task.getDuration();
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
								task._lateStart = lateEnd - task.getDuration();
								
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex+1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex--;
							}
						}
					}
					
					project._start = 0;
					project._end = endOfProject;
				}
			};
		});
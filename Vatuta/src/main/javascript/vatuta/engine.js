/**
 * @module Engine
 */
define(
		[ "dojo/_base/declare", "./vatuta/project.js", "underscorejs" ],
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
					var alreadyCalculatedIndex = 0;
					while (alreadyCalculatedIndex < tasks.length) {
						for (i = alreadyCalculatedIndex; i < tasks.length; i++) {
							
							if (task.earlyStart && task.earlyEnd) {
								var aux = tasks[i];
								tasks[i] = tasks[alreadyCalculatedIndex+1];
								tasks[alreadyCalculatedIndex+1] = aux;
								alreadyCalculatedIndex++;
							}
						}
					}
					return "Dojo";
				}
			};
		});
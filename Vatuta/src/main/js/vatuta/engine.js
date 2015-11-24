/**
 * @module Engine
 */
define(
		[ "lodash", "moment", "./vatuta/Duration.js"],
		function(_, moment, Duration) {
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
					delete this._project._calculatedStart, this._project._calculatedEnd;
					_.forEach(this._project.tasks(), function(task) {
						delete task._earlyStart;
						delete task._earlyEnd;
						delete task._lateStart;
						delete task._lateEnd;
						delete task._actualStart;
						delete task._actualEnd;
					});
					
					// We clone the tasks array
					var tasks = _.clone(this._project.tasks());

					// Calculate early start and ending
					var alreadyCalculatedIndex = -1;
					var startOfProject = moment(this._project.baseStart());
					var endOfProject = moment(this._project.baseStart());
					while (alreadyCalculatedIndex < tasks.length - 1) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							// Calculate EarlyStart
							var earlyStart = NaN;
							if (task.earlyStart()) {
								earlyStart = task.earlyStart()
							} else {
								earlyStart = null;
								_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
									_.forEach(restrictions, function(restriction) {
										var restrictionValue = restriction.getMinEarlyStart4Task(this);
										if (isNaN(restrictionValue)) {
											earlyStart = NaN
										} else if (restrictionValue != 0) {
											if (earlyStart == null) {
												earlyStart = restrictionValue;
											} else {
												earlyStart = moment.max(earlyStart, restrictionValue);
											}
										}
									}, task);
								}, task);
								if (earlyStart == null) {
									earlyStart = moment(this._project.baseStart());
								}
								if (!isNaN(earlyStart)) {
									unknownResolvedInIteration = true;
									task.earlyStart(earlyStart);
									startOfProject = moment.min(startOfProject, task.earlyStart());
								}
							}
							
							// Calculate EarlyEnd
							var earlyEnd = NaN;
							if (task.earlyEnd()) {
								earlyEnd = task.earlyEnd()
							} else {
								earlyEnd = null;
								_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
									_.forEach(restrictions, function(restriction) {
										var restrictionValue = restriction.getMinEarlyEnd4Task(this);
										if (isNaN(restrictionValue)) {
											earlyEnd = NaN
										} else if (restrictionValue != 0) {
											if (earlyEnd == null) {
												earlyEnd = restrictionValue;
											} else {
												earlyEnd = moment.max(earlyEnd, restrictionValue);
											}
										}
									}, task);
								}, task);
								if (earlyEnd == null && task.earlyStart()) {
									earlyEnd = task.duration().addTo(task.earlyStart());
								}
								if (!isNaN(earlyEnd)) {
									unknownResolvedInIteration = true;
									task.earlyEnd(earlyEnd);
									endOfProject = moment.max(endOfProject, task.earlyEnd());
								}
							}
							if (!isNaN(earlyStart) && !isNaN(earlyEnd)) {
								task.actualStart(earlyStart);
								task.actualEnd(earlyEnd);
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex++;
							}
						}
						if (!unknownResolvedInIteration) {
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for early stage";
						}
					}
					
					// Calculate late start and ending
					alreadyCalculatedIndex = tasks.length;
					while (alreadyCalculatedIndex > 0) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex - 1; i >= 0; i--) {
							var task = tasks[i];
							// Calculate LateEnding
							var lateEnd = NaN;
							if (task.lateEnd()) {
								lateEnd = task.lateEnd()
							} else {
								lateEnd = null;
								_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
									_.forEach(restrictions, function(restriction) {
										var restrictionValue = restriction.getMaxLateEnd4Task(this);
										if (isNaN(restrictionValue)) {
											lateEnd = NaN
										} else if (isFinite(restrictionValue)) {
											if (lateEnd == null) {
												lateEnd = restrictionValue;
											} else {
												lateEnd = moment.min(lateEnd, restrictionValue);
											}
										}
									}, task);
								}, task);
								if (lateEnd == null) {
									lateEnd =  moment(endOfProject);
								}
								if (!isNaN(lateEnd)) {
									unknownResolvedInIteration = true;
									task.lateEnd(lateEnd);
								}
							}
							
							// Calculate Late Start
							var lateStart = NaN;
							if (task.lateStart()) {
								lateStart = task.lateStart()
							} else {
								lateStart = null;
								_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
									_.forEach(restrictions, function(restriction) {
										var restrictionValue = restriction.getMaxLateStart4Task(this);
										if (isNaN(restrictionValue)) {
											lateStart = NaN
										} else if (isFinite(restrictionValue)) {
											if (lateStart == null) {
												lateStart = restrictionValue;
											} else {
												lateStart = moment.min(lateStart, restrictionValue);
											}
										}
									}, task);
								}, task);
								if (lateStart == null && task.lateEnd()) {
									lateStart = task.duration().subtractFrom(task.lateEnd());
								}
								if (!isNaN(lateStart)) {
									unknownResolvedInIteration = true;
									task.lateStart(lateStart);
								}
							}
							
							if (!isNaN(lateStart) && !isNaN(lateEnd)) {
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex - 1];
									tasks[alreadyCalculatedIndex - 1] = aux;
								}
								alreadyCalculatedIndex--;
							}
						}
						if (!unknownResolvedInIteration) {
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for late stage";
						}
					}
					
					this._project.calculatedStart(startOfProject);
					this._project.calculatedEnd(endOfProject);
				}
			};
		});
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
					return this.currentProject().findTaskById(id);
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
					delete this.currentProject()._calculatedStart, this.currentProject()._calculatedEnd;
					_.forEach(this.currentProject().tasks(), function(task) {
						delete task._earlyStart;
						delete task._earlyEnd;
						delete task._lateStart;
						delete task._lateEnd;
						delete task._actualStart;
						delete task._actualEnd;
					});
					
					// We clone the tasks array
					var tasks = _.clone(this.currentProject().tasks());

					// Calculate early start and ending
					var alreadyCalculatedIndex = -1;
					var startOfProject = moment(this.currentProject().baseStart());
					var endOfProject = moment(this.currentProject().baseStart());
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
									earlyStart = moment(this.currentProject().baseStart());
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
					
					this.currentProject().calculatedStart(startOfProject);
					this.currentProject().calculatedEnd(endOfProject);
				},
				/**
				 * Detect circular dependencies on project, based on Tarjan algorithm
				 * 
				 * @function
				 * 
				 */
				detectCircularDependencies : function() {
					var index = 0;
					var stack = [];
					var circularDependencies = [];
					
					var strongConnect = function(task) {
						// Set the depth index for task to the smallest unused index
					    task._$index = index;
					    task._$lowlink = index;
					    index++;
					    stack.push(task);
					    task._$onStack = true;
					    
					    // Consider successors of task
					    _.forEach(task.restrictionsFromDependants(), function(restriction) {
					    	var dependant = restriction.dependant();
					    	if (!dependant._$index) {
						        // Dependant has not yet been visited; recurse on it
						        strongConnect(dependant);
						        task._$lowlink  = Math.min(task._$lowlink, dependant._$lowlink);
					    	} else if (dependant._$onStack) {
						        // Successor w is in stack S and hence in the current SCC
					    		task._$lowlink  = Math.min(task._$lowlink, dependant._$index);
					    	}
					    }, task);
					    
					    // If v is a root node, pop the stack and generate an SCC
					    if (task._$lowlink == task._$index) {
					    	var tasks = [];
					    	do {
					    	  	var dependant = stack.pop()
						        dependant._$onStack = false;
					    	  	tasks.push(dependant);
						    } while (task.id() != dependant.id());
					    	// If SCC contains more than one element, it implies a cicular dependency
					    	if (tasks.length > 1) {
					    		circularDependencies.push(tasks);
					    	}
					    }
					};
					

					_.forEach(this.currentProject().tasks(), function(task) {
						if (!task._$index) {
							strongConnect(task);
						}
					});
					_.forEach(this.currentProject().tasks(), function(task) {
						delete task._$index;
						delete task._$lowlinj;
						delete task._$onStack;
					});
					
					return circularDependencies;
				}
			};
		});

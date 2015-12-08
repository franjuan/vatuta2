/**
 * @module Engine
 */
define(
		[ "lodash", "moment", "./vatuta/Duration.js","./vatuta/tactics.js"],
		function(_, moment, Duration, Tactics) {
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
					delete this.currentProject()._actualStart, this.currentProject()._actualEnd;
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
					var startOfProject = moment(this.currentProject().earlyStart());
					var endOfProject = moment(this.currentProject().earlyStart());
					while (alreadyCalculatedIndex < tasks.length - 1) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							
							// Calculate EarlyStart
							var earlyStart;
							if (task.earlyStart()) {
								earlyStart = task.earlyStart();
							} else {
								earlyStart = task.getDefaultEarlyStart();
								if (!isNaN(earlyStart)) {
									_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
										_.forEach(restrictions, function(restriction) {
											var restrictionValue = restriction.getMinEarlyStart4Task(this);
											if (isNaN(restrictionValue)) {
												earlyStart = NaN
												return false;
											} else if (restrictionValue != 0) {
												if (earlyStart == 0) {
													earlyStart = restrictionValue;
												} else {
													earlyStart = moment.max(earlyStart, restrictionValue);
												}
											}
										}, task);
									}, task);
									if (!isNaN(earlyStart) && earlyStart != 0) {
										unknownResolvedInIteration = true;
										task.earlyStart(earlyStart);
										startOfProject = moment.min(startOfProject, task.earlyStart());
									} else {
										earlyStart = NaN;
									}
								}
							}
							
							// Calculate EarlyEnd
							var earlyEnd;
							if (task.earlyEnd()) {
								earlyEnd = task.earlyEnd()
							} else {
								earlyEnd = task.getDefaultEarlyEnd();
								if (!isNaN(earlyEnd)){
									_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
										_.forEach(restrictions, function(restriction) {
											var restrictionValue = restriction.getMinEarlyEnd4Task(this);
											if (isNaN(restrictionValue)) {
												earlyEnd = NaN
												return false;
											} else if (restrictionValue != 0) {
												if (!isFinite(earlyEnd)) {
													earlyEnd = restrictionValue;
												} else {
													earlyEnd = moment.min(earlyEnd, restrictionValue);
												}
											}
										}, task);
									}, task);
									if (!isNaN(earlyEnd) && isFinite(earlyEnd)) {
										unknownResolvedInIteration = true;
										task.earlyEnd(earlyEnd);
										endOfProject = moment.max(endOfProject, task.earlyEnd());
									} else {
										earlyEnd = NaN;
									}
								}
							}
							if (!isNaN(earlyStart) && !isNaN(earlyEnd)) {
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								unknownResolvedInIteration = true;
								alreadyCalculatedIndex++;
							}
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for early stage";
						}
						this.showState(this.currentProject(), tasks);
					}
					this.currentProject().lateEnd(endOfProject);
					
					// Calculate late start and ending
					alreadyCalculatedIndex = tasks.length;
					while (alreadyCalculatedIndex > 0) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex - 1; i >= 0; i--) {
							var task = tasks[i];
							// Calculate LateEnding
							var lateEnd;
							if (task.lateEnd()) {
								lateEnd = task.lateEnd()
							} else {
								lateEnd = task.getDefaultLateEnd();
								if (!isNaN(lateEnd)) {
									_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
										_.forEach(restrictions, function(restriction) {
											var restrictionValue = restriction.getMaxLateEnd4Task(this);
											if (isNaN(restrictionValue)) {
												lateEnd = NaN
												return false;
											} else if (isFinite(restrictionValue)) {
												if (lateEnd == null) {
													lateEnd = restrictionValue;
												} else {
													lateEnd = moment.min(lateEnd, restrictionValue);
												}
											}
										}, task);
									}, task);
									if (!isNaN(lateEnd)) {
										unknownResolvedInIteration = true;
										task.lateEnd(lateEnd);
									}
								}
							}
							
							// Calculate Late Start
							var lateStart;
							if (task.lateStart()) {
								lateStart = task.lateStart()
							} else {
								lateStart = task.getDefaultLateStart();
								if (!isNaN(lateStart)){
									_.forEach([task.restrictions(), task.restrictionsFromDependants()], function(restrictions) {
										_.forEach(restrictions, function(restriction) {
											var restrictionValue = restriction.getMaxLateStart4Task(this);
											if (isNaN(restrictionValue)) {
												lateStart = NaN
												return false;
											} else if (isFinite(restrictionValue)) {
												if (lateStart == null) {
													lateStart = restrictionValue;
												} else {
													lateStart = moment.max(lateStart, restrictionValue);
												}
											}
										}, task);
									}, task);
									if (!isNaN(lateStart)) {
										unknownResolvedInIteration = true;
										task.lateStart(lateStart);
									}
								}
							}
							
							if (!isNaN(lateStart) && !isNaN(lateEnd)) {
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex - 1];
									tasks[alreadyCalculatedIndex - 1] = aux;
								}
								unknownResolvedInIteration = true;
								alreadyCalculatedIndex--;
							}
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (tasks.length - alreadyCalculatedIndex + 1) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for late stage";
						}
					}
					
					// TODO Mover los actual a última fase de cálculo
					this.currentProject().actualStart(startOfProject);
					this.currentProject().actualEnd(endOfProject);
					
					// Calculate actual start and ending
					var alreadyCalculatedIndex = -1;
					while (alreadyCalculatedIndex < tasks.length - 1) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							
							// Calculate EarlyStart
							if (task.actualStart()) {
								actualStart = task.actualStart()
							} else {
								actualStart = task.tactic().getActualStart4Task(task);
								if (!isNaN(actualStart)) {
									unknownResolvedInIteration = true;
									task.actualStart(actualStart);
								}
							}
							
							// Calculate EarlyEnd
							if (task.actualEnd()) {
								actualEnd = task.actualEnd()
							} else {
								actualEnd = task.tactic().getActualEnd4Task(task);
								if (!isNaN(actualEnd)) {
									unknownResolvedInIteration = true;
									task.actualEnd(actualEnd);
								}
							}
							if (!isNaN(earlyStart) && !isNaN(earlyEnd)) {
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex++;
							}
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for actual stage";
						}
					}
					this.showState(this.currentProject(), tasks);
				},
				showState: function(project, tasks) {
					console.log('                      EarlyStart EarlyEnd   LateStart  LateEnd');
					console.log(('Project             : ' + (project.earlyStart()?project.earlyStart().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.earlyEnd()?project.earlyEnd().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.lateStart()?project.lateStart().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.lateEnd()?project.lateEnd().format('DD/MM/YYYY'):'          ') + ' ' ));
					_.forEach(tasks, function(task) {
						console.log((('                   ' + task.name()).slice(-20)+': '
								 + (task.earlyStart()?task.earlyStart().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.earlyEnd()?task.earlyEnd().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.lateStart()?task.lateStart().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.lateEnd()?task.lateEnd().format('DD/MM/YYYY'):'          ') + ' ' ));
					});
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

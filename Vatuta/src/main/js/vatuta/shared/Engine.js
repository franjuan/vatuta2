/**
 * @module Engine
 */
define(
		[ "lodash", "moment", "vatuta/shared/Duration","vatuta/shared/Tactics"],
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
					// TODO Review project before calculating values, i.e. duration() is a valid value for every task
					// Remove old values
					delete this.currentProject()._actualStart;
					delete this.currentProject()._actualEnd;
					_.forEach(this.currentProject().tasks(), function(task) {
						delete task._earlyStart;
						delete task._earlyEnd;
						delete task._lateStart;
						delete task._lateEnd;
						delete task._actualStart;
						delete task._actualEnd;
						
						task._$engine = {};
					});
					
					// We clone the tasks array
					var tasks = _.clone(this.currentProject().tasks());

					// Calculate early start and ending
					var alreadyCalculatedIndex = -1;
					var startOfProject = 0;
					var endOfProject = moment(this.currentProject().earlyStart());
					while (alreadyCalculatedIndex < tasks.length - 1) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							
							// Calculate EarlyStart
							var earlyStart;
							if (task._$engine.earlyStart) { // If already calculated
								earlyStart = task.earlyStart();
							} else {
								earlyStart = task.getDefaultEarlyStart(); // Gets default value depending on task type
								if (!!earlyStart) { // If valid value
									_.forEach(task.getRestrictionsForScheduling(), function(restriction) {
										earlyStart = task.applyRestrictionForEarlyStart(restriction, earlyStart); // Apply restriction
										return !!earlyStart; // If false it finishes loop
									}, task);
									earlyStart = isFinite(earlyStart)?earlyStart:this.currentProject().earlyStart();
									if(task.applyEarlyStart(earlyStart)) { // If value can be applied to task
										task._$engine.earlyStart = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
										// TODO: Quitar esto de aquí y delegar en el proyecto
										startOfProject = startOfProject==0?task.earlyStart():moment.min(startOfProject, task.earlyStart());	
									}
								}
							}
							
							// Calculate EarlyEnd
							var earlyEnd;
							if (task._$engine.earlyEnd) { // If already calculated
								earlyEnd = task.earlyEnd();
							} else {
								earlyEnd = task.getDefaultEarlyEnd(); // Gets default value depending on task type
								if (!!earlyEnd) { // If valid value
									_.forEach(task.getRestrictionsForScheduling(), function(restriction) {
										earlyEnd = task.applyRestrictionForEarlyEnd(restriction, earlyEnd); // Apply restriction
										return !!earlyEnd; // If false it finishes loop
									}, task);
									if(task.applyEarlyEnd(earlyEnd)) { // If value can be applied to task
										task._$engine.earlyEnd = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
										// TODO: Quitar esto de aquí y delegar en el proyecto
										endOfProject = moment.max(endOfProject, task.earlyEnd());	
									}
								}
							}
							
							if (!!earlyStart && !!earlyEnd) { // If both has been calculated move up in list and avoid recalculating
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
								alreadyCalculatedIndex++; // Consider last item for calculation in list
							}
							console.log ("Task: " + task.name() + " on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for early stage");
							this.showState(this.currentProject(), tasks);
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for early stage";
						}
						
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
							if (task._$engine.lateEnd) { // If already calculated
								lateEnd = task.lateEnd();
							} else {
								lateEnd = task.getDefaultLateEnd(); // Gets default value depending on task type
								if (!!lateEnd) { // If valid value
									_.forEach(task.getRestrictionsForScheduling(), function(restriction) {
										lateEnd = task.applyRestrictionForLateEnd(restriction, lateEnd); // Apply restriction
										return !!lateEnd; // If false it finishes loop
									}, task);
									lateEnd = isFinite(lateEnd)?lateEnd:endOfProject;
									if(task.applyLateEnd(lateEnd)) { // If value can be applied to task
										task._$engine.lateEnd = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration

									}
								}
							}
							
							// Calculate LateStart
							var lateStart;
							if (task._$engine.lateStart) { // If already calculated
								lateStart = task.lateStart();
							} else {
								lateStart = task.getDefaultLateStart(); // Gets default value depending on task type
								if (!!lateStart) { // If valid value
									_.forEach(task.getRestrictionsForScheduling(), function(restriction) {
										lateStart = task.applyRestrictionForLateStart(restriction, lateStart); // Apply restriction
										return !!lateStart; // If false it finishes loop
									}, task);
									if(task.applyLateStart(lateStart)) { // If value can be applied to task
										task._$engine.lateStart = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration

									}
								}
							}
							
							if (!!lateStart && !!lateEnd) { // If both has been calculated move down in list and avoid recalculating
								if (i != alreadyCalculatedIndex - 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex - 1];
									tasks[alreadyCalculatedIndex - 1] = aux;
								}
								unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
								alreadyCalculatedIndex--; // Consider last item for calculation in list
							}
							console.log ("Task: " + task.name() + " on iteration " + (tasks.length - alreadyCalculatedIndex + 1) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for late stage");
							this.showState(this.currentProject(), tasks);
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (tasks.length - alreadyCalculatedIndex + 1) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for late stage";
						}
					}
					
					// TODO Recalculate early/late start/end while actual values (ALAP tactic compress the schedulling)
					
					
					
					// Calculate planned start and ending
					//this.currentProject()._$actualCalculated = true; // For root task to be considered
					var plannedProjectStart = 0;
					var plannedProjectEnd = 0;
					var alreadyCalculatedIndex = -1;
					while (alreadyCalculatedIndex < tasks.length - 1) {
						var unknownResolvedInIteration = false;
						for (var i = alreadyCalculatedIndex + 1; i < tasks.length; i++) {
							var task = tasks[i];
							
							// Calculate PlannedStart
							var plannedStartRange;
							if (!task._$engine.plannedStart) { // If already calculated
								plannedStartRange = [task.earlyStart(), task.lateStart()]; // Gets current start range
								if (!!plannedStartRange[0] && !!plannedStartRange[1]) { // If valid value
									_.forEach(task.getRestrictionsForPlanning(), function(restriction) {
										plannedStartRange = task.applyRestrictionForPlannedStart(restriction, plannedStartRange); // Apply restriction
										return !!plannedStartRange[0] && !!plannedStartRange[1]; // If false it finishes loop
									}, task);
									if(task.applyPlannedStart(plannedStartRange)) { // If value can be applied to task
										task._$engine.plannedStart = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
										var plannedStart = task.applyTactic4PlannedStart(plannedStartRange);
										plannedProjectStart = plannedProjectStart == 0 ? plannedStart : moment.min(plannedProjectStart, plannedStart);
									}
								}
							}
							
							// Calculate PlannedEnd
							var plannedEndRange;
							if (!task._$engine.plannedEnd) { // If already calculated
								plannedEndRange = [task.earlyEnd(), task.lateEnd()]; // Gets current End range
								if (!!plannedEndRange[0] && !!plannedEndRange[1]) { // If valid value
									_.forEach(task.getRestrictionsForPlanning(), function(restriction) {
										plannedEndRange = task.applyRestrictionForPlannedEnd(restriction, plannedEndRange); // Apply restriction
										return !!plannedEndRange[0] && !!plannedEndRange[1]; // If false it finishes loop
									}, task);
									if(task.applyPlannedEnd(plannedEndRange)) { // If value can be applied to task
										task._$engine.plannedEnd = true; // Mark task as calculted for the value
										unknownResolvedInIteration = true; // Notify engine than improvements has been performed in this iteration
										var plannedEnd = task.applyTactic4PlannedEnd(plannedEndRange);
										plannedProjectEnd = plannedProjectEnd == 0 ? plannedEnd : moment.max(plannedProjectEnd, plannedEnd);
									}
								}
							}
							
							if (task._$engine.plannedStart && task._$engine.plannedEnd) {
								if (i != alreadyCalculatedIndex + 1) {
									var aux = tasks[i];
									tasks[i] = tasks[alreadyCalculatedIndex + 1];
									tasks[alreadyCalculatedIndex + 1] = aux;
								}
								alreadyCalculatedIndex++;
							}
							
							console.log ("Task: " + task.name() + " on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for planned stage");
							this.showState(this.currentProject(), tasks);
						}
						if (!unknownResolvedInIteration) {
							this.showState(this.currentProject(), tasks);
							throw "Lock on iteration " + (alreadyCalculatedIndex + 2) + " (alreadyCalculatedIndex= " + alreadyCalculatedIndex + ") for actual stage";
						}
					}
					
					// Set the actual start and end for project
					this.currentProject().actualStart(plannedProjectStart);
					this.currentProject().actualEnd(plannedProjectEnd);
					
					this.showState(this.currentProject(), tasks);
					
					// Remove temp vars
					_.forEach(this.currentProject().tasks(), function(task) {
						delete task._$engine;
					});
				},
				showState: function(project, tasks) {
					console.log('                      EarlyStart EarlyEnd   LateStart  LateEnd    ActualStartActualEnd  ');
					console.log(('Project             : ' + (project.earlyStart()?project.earlyStart().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.earlyEnd()?project.earlyEnd().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.lateStart()?project.lateStart().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.lateEnd()?project.lateEnd().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.actualStart()?project.actualStart().format('DD/MM/YYYY'):'          ') + ' '
														 + (project.actualEnd()?project.actualEnd().format('DD/MM/YYYY'):'          ') + ' '));
					_.forEach(tasks, function(task) {
						console.log((('                   ' + task.name()).slice(-20)+': '
								 + (task.earlyStart()?task.earlyStart().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.earlyEnd()?task.earlyEnd().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.lateStart()?task.lateStart().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.lateEnd()?task.lateEnd().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.actualStart()?task.actualStart().format('DD/MM/YYYY'):'          ') + ' '
								 + (task.actualEnd()?task.actualEnd().format('DD/MM/YYYY'):'          ') + ' '));
					});
				},
				getMinEarlyStartConstraints: function(task) {
					return this.getAllConstraintsOnTask(task, "getMinEarlyStart4Task");
				},
				getMinEarlyEndConstraints: function(task) {
					return this.getAllConstraintsOnTask(task, "getMinEarlyEnd4Task");
				},
				getMaxLateStartConstraints: function(task) {
					return this.getAllConstraintsOnTask(task, "getMaxLateStart4Task");
				},
				getMaxLateEndConstraints: function(task) {
					return this.getAllConstraintsOnTask(task, "getMaxLateEnd4Task");
				},
				getAllConstraintsOnTask: function(task, f) {
					return this.getConstraintsOnTask(task, f, [task.restrictions(), task.restrictionsFromDependants()]);
				},
				getConstraints4PlannedStart: function(task, f) {
					return this.getDependenciesConstraintsOnTask(task, "restrictPlannedStartRange");
				},
				getConstraints4PlannedEnd: function(task, f) {
					return this.getDependenciesConstraintsOnTask(task, "restrictPlannedEndRange");
				},
				getDependenciesConstraintsOnTask: function(task, f) {
					return this.getConstraintsOnTask(task, f, [task.restrictions()]);
				},
				
				getConstraintsOnTask: function(task, f, restrictions, constraints) {
					if (!constraints) {
						var constraints = [];
					}
					_.forEach(restrictions, function(restrictions) {
						_.forEach(restrictions, function(restriction) {
							constraints.push(_.bind(restriction[f], restriction, task));
						}, task);
					}, task);
					//if (task.parent().getConstraintsOnTask) {
					//	this.getConstraintsOnTask(task.parent(), f, constraints);
					//}
					return constraints;
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
					    
//					    // Consider childrens of task
//					    if (task.children) {
//						    _.forEach(task.children(), function(child) {
//						    	if (!child._$index) {
//							        // Dependant has not yet been visited; recurse on it
//							        strongConnect(child);
//							        task._$lowlink  = Math.min(task._$lowlink, child._$lowlink);
//						    	} else if (child._$onStack) {
//							        // Successor w is in stack S and hence in the current SCC
//						    		task._$lowlink  = Math.min(task._$lowlink, child._$index);
//						    	}
//						    }, task);
//					    }
//					    
//					    // Consider parent of task
//					    if (!task.parent().isInstanceOf(Project)) {
//					    	if (!task.parent()._$index) {
//						        // Dependant has not yet been visited; recurse on it
//						        strongConnect(task.parent());
//						        task._$lowlink  = Math.min(task._$lowlink, task.parent()._$lowlink);
//					    	} else if (child._$onStack) {
//						        // Successor w is in stack S and hence in the current SCC
//					    		task._$lowlink  = Math.min(task._$lowlink, task.parent()._$index);
//					    	}
//					    }
					    
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

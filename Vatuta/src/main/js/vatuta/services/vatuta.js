define([ "vatuta/shared/Project", "vatuta/shared/Task", "vatuta/shared/BaseTask", "vatuta/shared/SummaryTask", "vatuta/shared/Engine",
		"vatuta/shared/Restriction", "vatuta/shared/Tactics", "vatuta/shared/Canvas", "moment", "vatuta/shared/Duration", "vatuta/vatutaMod"  ], function(Project,
		Task, BaseTask, SummaryTask, Engine, Restrictions, Tactics, Canvas, moment, Duration) {

	angular.module('vatuta').service('Project', [ function() {
		return Project;
	} ]);
	
	angular.module('vatuta').service('Task', [ function() {
		return Task;
	} ]);
	
	angular.module('vatuta').service('SummaryTask', [ function() {
		return SummaryTask;
	} ]);
	
	angular.module('vatuta').service('Engine', [ function() {
		return Engine;
	} ]);
	
	angular.module('vatuta').service('Canvas', [ function() {
		return Canvas;
	} ]);
	
	angular.module('vatuta').factory('Restrictions', [ function() {
		return Restrictions;
	} ]);
	
	angular.module('vatuta').factory('ProjectHandler', ["$q", function($q) {
		return {
			addTask: function(project, task, parent, index) {
				var deferred = $q.defer();
				
			    deferred.notify('About to create new task.');
			    
			    try {
					var newTask;
					if (task) {
						if (task.isInstanceOf(BaseTask)) {
							newTask = task;
						} else {
							newTask = new Task(task);
						}
					} else {
						newTask = new Task({_name: "New", _duration: new Duration({days: 1})});
					}
					if (!parent || parent.isInstanceOf(Project)) {
						project.addTask(newTask, null, !isNaN(index) ? index : project.tasks().length);
					} else {
						if (parent.isInstanceOf(SummaryTask)) {
							project.addTask(newTask, parent, !isNaN(index) ? index : (parent.children().length + parent.index()));
						} else {
							var newParent = this.convertTaskToSummary(project, parent);
							project.replaceTask(newParent);
							project.addTask(newTask, newParent, !isNaN(index) ? index : (newParent.children().length + newParent.index()));
						}
					}
					Engine.calculateEarlyStartLateEnding();
					
					deferred.resolve(newTask);
			    } catch (err) {
			    	deferred.reject(err);
			    }

			    return deferred.promise;
			},
			convertTaskToSummary: function(project, task) {
				var keys = _.filter(_.keysIn(task), function(key){return key.startsWith("_") && !key.endsWith("inherited")});
				var properties = _.pick(task, keys);
				var newTask = new SummaryTask(properties);
				return newTask;
			},
			convertSummaryToTask: function(project, task) {
				var keys = _.filter(_.keysIn(task), function(key){return key.startsWith("_") && !key.endsWith("inherited")});
				var properties = _.pick(task, keys);
				if (!properties._duration) {
					properties._duration = new Duration({days : 1});
				}
				var newTask = new Task(properties);
				return newTask;
			},
			deleteTask: function(project, task) {
				var deferred = $q.defer();
				
				var name = task.name();
				
			    deferred.notify('About to delete ' + name + '.');
			    
			    try {
			    	var parent = task.parent();
			    	
			    	project.removeTask(task);
			    	
			    	if (parent.isInstanceOf(SummaryTask) && parent.children().length == 0) {
			    		var newTask = this.convertSummaryToTask(project, parent);
			    		project.replaceTask(newTask);
			    	}
			    	
			    	Engine.calculateEarlyStartLateEnding();
			    	
			    	deferred.resolve(task);
			    } catch (err) {
			    	deferred.reject(err);
			    }

			    return deferred.promise;
			}
		}
	} ]);
	
	angular.module('vatuta').factory('ProjectSerializer', [ function() {
		var namespace = {};
		namespace.BaseTask = BaseTask;
		namespace.Task = Task;
		namespace.SummaryTask = SummaryTask;
		namespace.Project = Project;
		namespace.EndToStartDependency = Restrictions.EndToStart;
		namespace.StartToEndDependency = Restrictions.StartToEnd;
		namespace.StartToStartDependency = Restrictions.StartToStart;
		namespace.EndToEndDependency = Restrictions.EndToEnd;
		namespace.Restriction = Restriction;
		namespace.PlanningTactic = PlanningTactic;
		namespace.ASAPTactic = Tactics.getTacticConstructorByName('ASAP');
		namespace.ALAPTactic = Tactics.getTacticConstructorByName('ALAP');
		namespace.ManualTactic = Tactics.getTacticConstructorByName('Manual');
		namespace.Duration = Duration;
		
		var serializers = {};
		serializers["n"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("n", object.toISOString());
				},
				deserialize: function(value) {
					return moment(value);
				}
		};
		// TODO: Analyse why is changing name of constructor
		serializers["Moment"] = serializers["n"];
		serializers["o"] = serializers["n"];
		var necromancer = new Resurrect(
				{
					resolver: new Resurrect.NamespaceResolver(
									namespace,
									function(object, constructor){
										if (constructor === '') {
									    	if (object.__proto__ && object.__proto__.declaredClass) {
									    		return constructor = object.__proto__.declaredClass;
									    	}
									    } else {
									    	return constructor;
									    }
									}
								),
					serializers: serializers,
					cleanup: true
				}
			);
		
		return {
			serializeProject: function(project) {
				return necromancer.stringify(project, function(key, value){
					if (key==='_inherited') {
						return undefined;
					} else if (key.indexOf('_$') === 0){
						return undefined;
					} else {
						return value;
					}
				});
			},
			deserializeProject: function(json) {
				return necromancer.resurrect(json);
			}
		};
	} ]);
	
	angular.module('vatuta').factory('$project', [ function() {
		var project = new Project({
			_name : "Example Project"
		});
		// TODO Engine should be a service and use the $project service as a reference to it
		Engine.currentProject(project);

		// Start2End
		var base = new Task({
			_name : "Base",
			_duration : new Duration({
				days : 4
			}),
			_tactic: Tactics.MANUAL.name(),
			_manualStart: moment().add(2, 'days'),
			_manualEnd: moment().add(6, 'days')
		});
		project.addTask(base);

		var summary = new SummaryTask({
			_name : "Summary"
		});
		project.addTask(summary);

		var taskA = new Task({
			_name : "A",
			_duration : new Duration({
				days : 5
			})
		});
		project.addTask(taskA, summary);

		var taskB = new Task({
			_name : "B",
			_duration : new Duration({
				days : 4
			}),
			_tactic: Tactics.MANUAL.name(),
			_manualStart: moment().add(8, 'days'),
			_manualEnd: moment().add(12, 'days')
		});
		project.addTask(taskB, summary);

		var taskC = new Task({
			_name : "C",
			_duration : new Duration({
				days : 6
			})
		});
		project.addTask(taskC, summary);

		new Restrictions.StartToStart({
			_dependency : base,
			_dependant : summary
		});

		new Restrictions.EndToStart({
			_dependency : taskA,
			_dependant : taskB
		});

		new Restrictions.StartToEnd({
			_dependency : taskB,
			_dependant : taskC
		});
		
		project.calendar = {
				
				timetables:  [{id: 1,
							  name:'Base',
							  description: '',
							  color: '#C5CAE9',
							  period: {units:'week', value: 1},
							  increment: {units:'day', value: 1},
							  slices:[
							             {sliceSelector:[false,true,true,true,true,false,false],
							             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:13,minutes:0}},
							                     {from:{hours:14, minutes:0}, to:{hours:17,minutes:0}}
							                     ]},
					                     {sliceSelector:[false,false,false,false,false,true,false],
							             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
							                     ]},
					                     {sliceSelector:[true,false,false,false,false,false,true],
								             workingTimes:[]}
							             ]},
		                     {id:2,
							  name:'Summer',
							  description: '',
							  color: '#FFA000',
							  period: {units:'week', value: 1},
							  increment: {units:'day', value: 1},
							  slices:[
							             {sliceSelector:[false,true,true,true,true,true,false],
							             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
							                     ]},
					                     {sliceSelector:[true,false,false,false,false,false,true],
								             workingTimes:[]}
							             ]},
		                     {id:3,
							  name:'Vacation',
							  description: '',
							  color: '#FF5252',
							  period: {units:'week', value: 1},
							  increment: {units:'day', value: 1},
							  slices:[
					                     {sliceSelector:[true,true,true,true,true,true,true],
								             workingTimes:[]}
							             ]}]};
		project.calendar.tree = 		
				{	isBranch:true,
					lowDate: moment([2016,6,1]),
					highDate: moment([2016,8,1]),
					lowChild: {isLeaf:true, timetable:project.calendar.timetables[0]},
					middleChild: {isLeaf:true, timetable:project.calendar.timetables[1]},
					highChild: {isLeaf:true, timetable:project.calendar.timetables[0]}
					
				};
//		project.calendar.tree = 		
//		{	isLeaf:true, timetable:project.calendar.timetables[1]};
		
		Engine.calculateEarlyStartLateEnding();
		
		return project;
	} ]);
	
});
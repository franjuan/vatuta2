define([ "vatuta/shared/Project", "vatuta/shared/Task", "vatuta/shared/BaseTask", "vatuta/shared/SummaryTask", "vatuta/shared/Engine",
		"vatuta/shared/Restriction", "vatuta/shared/Tactics", "vatuta/shared/Canvas", "moment", "vatuta/shared/Duration", "vatuta/vatutaMod" ], function(Project,
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
	
	angular.module('vatuta').factory('ProjectHandler', [ function() {
		return {
			addTask: function(project, task, parent) {
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
				if (!parent) {
					project.addTask(newTask);
				} else {
					if (parent.isInstanceOf(SummaryTask)) {
						project.addTask(newTask, parent);
					} else {
						var newParent = this.convertTaskToSummary(project, parent);
						
						project.addTask(newTask, newParent);
					}
				}
				Engine.calculateEarlyStartLateEnding();
				return newTask;
			},
			convertTaskToSummary: function(project, task) {
				var keys = _.filter(_.keysIn(task), function(key){return key.startsWith("_") && !key.endsWith("inherited")});
				var properties = _.pick(task, keys);
				var newTask = new SummaryTask(properties);
				project.replaceTask(newTask);
				return newTask;
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
		serializers["Moment"] = serializers["n"];
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
			_tactic: Tactics.MANUAL,
			_actualStart: moment(),
			_actualEnd: moment().add(4, 'days')
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
			})
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
		
		Engine.calculateEarlyStartLateEnding();
		
		return project;
	} ]);
	
});
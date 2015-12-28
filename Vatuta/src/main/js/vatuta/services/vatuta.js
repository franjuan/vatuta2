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
		namespace.Project = Project;
		namespace.EndToStartDependency = Restrictions.EndToStart;
		namespace.StartToEndDependency = Restrictions.StartToEnd;
		namespace.StartToStartDependency = Restrictions.StartToStart;
		namespace.EndToEndDependency = Restrictions.EndToEnd;
		namespace.Restriction = Restriction;
		namespace.PlanningTactic = PlanningTactic;
		namespace.ASAPTactic = Tactics.ASAP;
		namespace.Duration = Duration;
		
		var serializers = {};
		serializers["Moment"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Moment", object.toISOString());
				},
				deserialize: function(value) {
					return moment(value);
				}
		};
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
	
});
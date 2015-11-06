define([ "./vatuta/project.js", "./vatuta/task.js", "./vatuta/engine.js",
		"./vatuta/restriction.js", "./vatuta/canvas.js", "moment" ], function(Project,
		Task, Engine, Restrictions, Canvas, moment) {

	var vatutaMod = angular.module('vatuta', [])
		.config( ['$compileProvider', function( $compileProvider )
			    {
					// To allow download gantt
			        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|mailto):|data:image\//);
			    }
	]);

	vatutaMod.service('Project', [ function() {
		return Project;
	} ]);
	
	vatutaMod.service('Task', [ function() {
		return Task;
	} ]);
	
	vatutaMod.service('Engine', [ function() {
		return Engine;
	} ]);
	
	vatutaMod.service('Canvas', [ function() {
		return Canvas;
	} ]);
	
	vatutaMod.factory('Restrictions', [ function() {
		return Restrictions;
	} ]);
	
	vatutaMod.factory('DurationUtils', [ function() {
		return {
			validator: function(s) {
							var re = /(\d+[\.\,]?\d*)\s*([a-zA-Z]+)\s*/gi; 
							var units = {};
							var match;
							while (match = re.exec(s)) {
								var unit = moment.normalizeUnits(match[2]);
								var value = parseFloat(match[1]);
								if (!unit) {
									return match[2] + " is not a valid time unit (y, M, w, d, h, m, s, ms)"; 
								} else {
									units[unit+'s'] = value;
								}
							    console.log(value + "=" + match[2] + " - " + unit);
							}
							return moment.duration(units);
						},
			formatter: function(duration) {
							var units = ['years','months','days','hours','minutes','seconds','milliseconds'];
							var s = "";
							for (var i=0; i<units.length; i++) {
								var value = duration._data[units[i]];
							    if (value>0) {
							    	if (s) s+= " ";
							    	s+=value + " ";
							    	if (value == 1) {
							    		s+=units[i].substr(0, units[i].length - 1);
							    	} else {
							    		s+=units[i];
							    	}
							    	
							    }
							}
							return s;
						}
		};
	}]);
	
	vatutaMod.factory('ProjectSerializer', [ function() {
		var namespace = {};
		namespace.Task = Task;
		namespace.Project = Project;
		namespace.EndToStartDependency = Restrictions.EndToStart;
		namespace.Restriction = Restriction;
		
		var serializers = {};
		serializers["Moment"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Moment", object.toISOString());
				},
				deserialize: function(value) {
					return moment(value);
				}
		};
		serializers["Duration"]= {
				serialize: function(object) {
					return Resurrect.prototype.builder.bind(necromancer)("Duration", object.toISOString());
				},
				deserialize: function(value) {
					return moment.duration(value);
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
					serializers: serializers
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
	

	
	vatutaMod.directive('vatutaTaskEditor', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      selectedTask: '=selectedTask'
			    },
			    templateUrl: 'vatuta/templates/vatutaTaskEditor.html'
			  };
			});

	vatutaMod.directive('vatutaGantt', function($mdDialog) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      listener: '='
			    },
			    template: '<canvas id="ganttCanvas"></canvas>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
			    	$scope.canvas.drawTimeRuler($scope.project);
			    	$scope.canvas.drawProject($scope.project);
			    },
			    controller: function($scope, $attrs) {
//		            $scope.$on('addTask', function(task) {
//		                console.log('addTask');
//		                $scope.canvas.clear();
//		                $scope.canvas.drawProject($scope.project);
//		                $scope.canvas.drawTimeRuler($scope.project);
//		            });
		            $scope.$on('changeTask', function(task) {
		                console.log('changeTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawProject($scope.project);
		                $scope.canvas.drawTimeRuler($scope.project);
		            });
		        }
			  };
			});
	
	vatutaMod.directive('restrictionListItem', function() {
		  return {
			    restrict: 'EAC',
			    scope: {
			      restriction: '='
			    },
			    template: '<div ng-include="getTemplateUrl()"></div>',
			    controller: function($scope) {
			        //function used on the ng-include to resolve the template
			        $scope.getTemplateUrl = function() {
			        	return 'vatuta/templates/' + $scope.restriction.template;
			        }
			    }
			  };
			});
	
	return vatutaMod;
});
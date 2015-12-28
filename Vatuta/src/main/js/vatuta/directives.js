define(["vatuta/shared/Canvas", "vatuta/shared/Duration", "vatuta/directives/TaskEditorDirective", "vatuta/vatutaMod", "vatuta/vatutaApp"], function(Canvas, DurationUtils) {

	angular.module('vatuta').directive('vatutaGantt', function($mdDialog) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      listener: '='
			    },
			    template: '<canvas id="ganttRuler"></canvas><canvas id="ganttCanvas"></canvas>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
			    	$scope.canvas.drawTimeRuler($scope.project);
			    	$scope.canvas.drawProject($scope.project);
			    },
			    controller: function($scope, $attrs) {
			    	var onTaskChange = function(event, task) {
		                console.log('changeTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawProject($scope.project, task);
		                $scope.canvas.drawTimeRuler($scope.project);
		            };
		            var onTaskSelection = function(event, task) {
		                console.log('selected Task');
		                $scope.canvas.drawSelectedTask(task, $scope.project);
		            };
		            $scope.$on('addTask', onTaskChange);
		            $scope.$on('deleteTask', onTaskChange);
		            $scope.$on('changeTask', onTaskChange);
		            $scope.$on('taskSelected', onTaskSelection);
		        }
			  };
			});
	
	angular.module('vatuta').directive('restrictionListItem', ['$mdDialog', '$mdToast', function($mdDialog, $mdToast) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      restriction: '='
			    },
			    template: '<div ng-include="getTemplateUrl()"></div>',
			    controllerAs: "ctrl",
			    controller: function($scope) {
			        //function used on the ng-include to resolve the template
			        $scope.getTemplateUrl = function() {
			        	return 'vatuta/templates/' + $scope.restriction.template;
			        }
			        
			        this.edit = function(restriction, event) {
						 
					}
					 
					this.remove = function(restriction, event) {
						 var description = restriction.shortDescription();
						 var confirm = $mdDialog.confirm()
				          .title('Would you like to delete restriction ' + restriction.shortDescription() + '?')
				          .content('Confirm you want to remove the ' + restriction.longDescription())
				          .ariaLabel('Remove {{restriction.shortDescription()}}')
				          .targetEvent(event)
				          .ok('Confirm removal')
				          .cancel("Don't do it!");
					    $mdDialog.show(confirm).then(function() {
					    	restriction.remove();
					    	$mdToast.show(
					                $mdToast.simple()
					                  .content(description + " has been removed")
					                  .position('top right')
					                  .hideDelay(1500)
					              );
					    ga('send', 'event', 'gantt', 'delete', 'restriction');
					    }, function() {
					        console.log('Removal of ' + description + ' cancelled');
					    });
					}
			    }
			  };
			}]);
	
	angular.module('vatutaApp').directive('duration', [function() {
		  return {
		    require: 'ngModel',
		    link: function(scope, elm, attrs, ctrl) {
		      ctrl.$validators.duration = function(modelValue, viewValue) {
		    	if (ctrl.$isEmpty(modelValue)) {
		            // consider empty models to be valid
		            return true;
		        }
		        return typeof DurationUtils.validator(modelValue) == "object";
		      };
		    }
		  };
		}]);
});
define(["vatuta/shared/Canvas", "vatuta/vatutaApp"], function(Canvas) {
	
	angular.module('vatutaApp').directive('vatutaGantt', function($mdDialog) {
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
});
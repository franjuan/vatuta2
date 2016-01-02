define(["vatuta/shared/Canvas", "vatuta/vatutaApp"], function(Canvas) {
	
	angular.module('vatutaApp').directive('vatutaGantt', ['$mdDialog', '$timeout', '$window', function($mdDialog, $timeout, $window) {
		  return {
			    restrict: 'EAC',
			    scope: {
			      project: '=projectData',
			      options: '=canvasOptions',
			      listener: '='
			    },
			    template: '<canvas id="ganttRuler"></canvas><div id="container"><canvas id="ganttCanvas"></canvas></div>',
			    link: function link($scope, element, attrs) {
			    	$scope.canvas = new Canvas(element, $scope.options);
			    	$scope.canvas.listener($scope.listener);
//			    	$timeout(function(){
//				    	$scope.canvas.drawTimeRuler($scope.project);
//				    	$scope.canvas.drawProject($scope.project);
//			    	});
			    },
			    controller: function($scope, $attrs) {
			    	var onTaskChange = function(event, task) {
		                console.log('changeTask');
		                $scope.canvas.clear();
		                $scope.canvas.drawProject($scope.project, task, $window);
		                $scope.canvas.drawTimeRuler($scope.project, $window);
		            };
		            var onTaskSelection = function(event, task) {
		                console.log('selected Task');
		                $scope.canvas.drawSelectedTask(task, $scope.project, $window);
		            };
		            $scope.$on('addTask', onTaskChange);
		            $scope.$on('deleteTask', onTaskChange);
		            $scope.$on('changeTask', onTaskChange);
		            $scope.$on('windowResize', onTaskChange);
		            $scope.$on('taskSelected', onTaskSelection);
		            
		            $("#container").scroll(function ()
            	    {
            	        $("#ganttRuler").offset({ left: -1*this.scrollLeft });
            	    });
		        }
			  };
			}]);
});
define([ "vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').controller('GanttToolBarMenuController', ['$scope', '$location', '$mdDialog', '$mdToast', '$mdSidenav', 'Task', 'Project', 'ProjectSerializer', 'Engine', 'VatutaHandler', function($scope, $location, $mdDialog, $mdToast, $mdSidenav, Task, Project, ProjectSerializer, Engine, VatutaHandler) {

		$scope.showProjectProperties = function(ev) {
			var newDialogScope = $scope.$new(false, $scope);
			newDialogScope.project = $scope.project;
			
		    $mdDialog.show({
		      controller: 'ProjectPropertiesDialogController',
		      templateUrl: 'vatuta/templates/ProjectPropertiesDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      scope: newDialogScope
		    })
		    .then(function(changed) {
		    	if (changed) {
		    		$mdToast.show(
		                $mdToast.simple()
		                  .content("Project "+ $scope.project.name() + "'s properties have been changed")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
		    	};
		    }, function() {});
		};
		
		$scope.showTaskInfo = function() {
			$mdSidenav('left').toggle();
		};
		
		$scope.deleteTask = function(task) {
			VatutaHandler.deleteTask(task)
		 	.then (function(task){},
		 			function(err){});
		};
		
		$scope.addChild = function(parentTask) {
			VatutaHandler.addChildTask(parentTask)
			.then(
				function(newTask){
					$scope.selectedTask = newTask;
					$mdSidenav('left').toggle();
				},
				function(err){});
		};
		
		$scope.addSiblingBefore = function(parentTask) {
			VatutaHandler.addSiblingTaskBefore(parentTask)
			.then(
				function(newTask){
					$scope.selectedTask = newTask;
					$mdSidenav('left').toggle();
				},
				function(err){});
		};
		
		$scope.addSiblingAfter = function(parentTask) {
			VatutaHandler.addSiblingTaskAfter(parentTask)
			.then(
				function(newTask){
					$scope.selectedTask = newTask;
					$mdSidenav('left').toggle();
				},
				function(err){});
		}
		
		}]);
});
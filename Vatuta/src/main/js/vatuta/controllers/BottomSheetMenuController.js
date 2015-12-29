define([ "vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').controller('BottomSheetMenuController', ['$scope', '$mdBottomSheet', 'Task', 'Engine', 'ProjectHandler', function($scope, $mdBottomSheet, Task, Engine, handler) {
		$scope.addTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project);
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.addSiblingTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project, null, $scope.selectedTask.parent());
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.addChildTask = function() {
			$scope.$parent.selectedTask = handler.addTask($scope.project, null, $scope.selectedTask);
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'New task added', show: true});
			$scope.$root.$broadcast('addTask', $scope.$parent.selectedTask);
			ga('send', 'event', 'gantt', 'create', 'task');
		}
		$scope.showTask = function() {
			$scope.toggleSidenav('left');
			$mdBottomSheet.hide({message: 'Showing task info', show: false});
		}
	}]);
});
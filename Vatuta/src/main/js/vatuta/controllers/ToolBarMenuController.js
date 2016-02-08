define([ "vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').controller('ToolBarMenuController', ['$scope', '$location', '$mdDialog', '$mdToast', '$mdSidenav', 'Task', 'Project', 'ProjectSerializer', 'Engine', 'VatutaHandler', function($scope, $location, $mdDialog, $mdToast, $mdSidenav, Task, Project, ProjectSerializer, Engine, VatutaHandler) {
		this.isOpen = false;
		$scope.projectProperties = function(event) {
			
		};
		$scope.fileOpen = function(event) {
			if(typeof(Storage) !== "undefined") {
				$scope.project = ProjectSerializer.deserializeProject(localStorage.getItem("project"));
				Engine.currentProject($scope.project);
				
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project loaded from your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
				ga('send', 'event', 'project', 'load');
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
		};
		$scope.fileSave = function(event) {
			if(typeof(Storage) !== "undefined") {
				var project = ProjectSerializer.serializeProject($scope.$parent.project);
				
				// Store
				localStorage.setItem("project", project);
				$mdToast.show(
		                $mdToast.simple()
		                  .content("Project saved on your local storage")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
				ga('send', 'event', 'project', 'store');
			} else {
				$mdDialog.show(
					      $mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('No local storage supported')
					        .content('Your browser does not support local storage.')
					        .ariaLabel('No local storage supported')
					        .ok('Ok')
					    );
			};
			
		};
		$scope.asImage = function($event) {
		      var parentEl = angular.element(document.body);
		       $mdDialog.show({
		         parent: parentEl,
		         targetEvent: $event,
		         templateUrl:  'vatuta/templates/downloadAsImage.html',
		         controller: function DialogController($scope, $mdDialog) {
				        $scope.closeDialog = function() {
				          $mdDialog.hide();
				        }
				        $scope.imageContents = function() {
							return angular.element("canvas#ganttCanvas")[0].toDataURL();
						}
		         }
		      });
		       ga('send', 'event', 'project', 'asImage');
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
		
		$scope.changeView = function ( path ) {
			  $location.path( path );
			};
		
		}]);
});
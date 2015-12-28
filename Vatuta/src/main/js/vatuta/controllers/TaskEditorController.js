define([ "vatuta/shared/Duration", "vatuta/vatutaApp"], function(DurationUtils) {	
	angular.module('vatutaApp').controller('TaskEditorController', ['$scope', '$mdDialog', '$mdToast', '$mdSidenav','Restrictions', 'Engine', function($scope,  $mdDialog, $mdToast, $mdSidenav, Restrictions, Engine) {
		this.showTaskDependency = function(ev) {
		    $mdDialog.show({
		      controller: 'TaskDependencyDialogController',
		      templateUrl: 'vatuta/templates/TaskDependencyDialog.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:false,
		      scope: $scope.$new(false, $scope)
		    })
		    .then(function(restriction) {
		    	// TODO Si en task no se selecciona una tarea, aunque esté el texto de búsqueda, da error porque restriction.task es null
		    	console.log(restriction.task.index() + restriction.type + ' created for task ' + $scope.selectedTask.index() + '.- ' + $scope.selectedTask.name());
		    	var restriction;
		    	switch (restriction.type) {
		    	  case "FS":
		    		  restriction = new Restrictions.EndToStart({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "FF":
		    		  restriction = new Restrictions.EndToEnd({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "SS":
		    		  restriction = new Restrictions.StartToStart({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	  case "SF":
		    		  restriction = new Restrictions.StartToEnd({
							_dependency : restriction.task,
							_dependant : $scope.selectedTask,
							_delay: restriction.delay?restriction.delay:new Duration()
						});
		    	    break;
		    	    
		    	}
				// Then detect circular dependencies
				var dependencies = Engine.detectCircularDependencies();
				if (dependencies.length > 0) {
					var newScope = $scope.$new(false, $scope);
					newScope.tasks = dependencies[0];
					newScope.restriction = restriction;
				    $mdDialog.show({
				    	  controller: 	function ($scope, $mdDialog) {
					    		  			$scope.close = function() {
					    		  				$mdDialog.hide();
					    		  			};
					    		  			$scope.cancel = function() {
					    		  				$mdDialog.hide();
					    		  			};
				    	  				},
					      templateUrl: 'vatuta/templates/circularDependencyFoundWarning.tmpl.html',
					      parent: angular.element(document.body),
					      clickOutsideToClose:true,
					      escapeToClose: true,
					      scope: newScope
				    }).then(
					    	function() {
					    		restriction.remove();
						    	$mdToast.show(
						                $mdToast.simple()
						                  .content(restriction.shortDescription() + " has been removed")
						                  .position('top right')
						                  .hideDelay(1500)
						              );
					        });
				}
		    	ga('send', 'event', 'gantt', 'create', 'restriction');
		    }, function() {
		    	console.log('You cancelled the TaskDependency dialog.');
		    });
		 };
		 
		 this.deleteTask  = function(task, event) {
			 var name = task.name();
			 var confirm = $mdDialog.confirm()
	          .title('Would you like to delete task ' + name + '?')
	          .content('Confirm you want to remove the task ' + task.index() + '.- ' + name)
	          .ariaLabel('Remove ' + name)
	          .targetEvent(event)
	          .ok('Confirm removal')
	          .cancel("Don't do it!");
		    $mdDialog.show(confirm).then(function() {
		    	$mdSidenav('left').toggle();
		    	task.remove();
		    	$scope.project.removeTask(task);
		    	$scope.$root.$broadcast('deleteTask', task);
		    	$mdToast.show(
		                $mdToast.simple()
		                  .content("Task " + name + " has been removed")
		                  .position('top right')
		                  .hideDelay(1500)
		              );
		    	ga('send', 'event', 'gantt', 'delete', 'task');
		    }, function() {
		        console.log('Removal of task ' + name + ' cancelled');
		    });
		 }

		 this.querySearch = function(query) {
			var results = query ? _.filter($scope.project.tasks(),filter(query)) : _.filter($scope.project.tasks(),function(task){return task.id()!==$scope.$parent.selectedTask.id();});
			return results;
		 }
		 
		 this.durationString= function(newDuration) {
			     if (arguments.length) {
			    	 $scope._durationString = newDuration;
			    	 var duration = DurationUtils.validator(newDuration);
			    	 if (typeof duration == "object")
			    		 $scope.selectedTask.duration(duration);
			     } else {
			    	 return $scope._durationString;
			     }
		 }
		 
		 $scope.$watch('selectedTask', function(newP, oldP, $scope){
			 $scope._durationString = newP?(newP.duration()?newP.duration().formatter():newP.actualDuration().humanize()):"";
		 });
	
		 function filter(query){
		      var lowercaseQuery = angular.lowercase(query);
		      return function filterFn(task) {
		        return task.id()!==$scope.$parent.selectedTask.id() && (task.index() === parseInt(query) || angular.lowercase(task.name()).indexOf(lowercaseQuery) !== -1);
		      };
		 }
	}]);
});
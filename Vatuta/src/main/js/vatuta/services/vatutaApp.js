define([ "vatuta/vatutaApp"  ], function() {

	angular.module('vatutaApp').factory('VatutaHandler', ["ProjectHandler", "$project", "$q", "$mdDialog", "$mdToast", "$rootScope",  function(ProjectHandler, $project, $q, $mdDialog, $mdToast, $rootScope) {
		return {
			deleteTask: function(task) {
				var deferred = $q.defer();
				
				var name = task.name();
				var confirm = $mdDialog.confirm()
		          .title('Would you like to delete task ' + name + '?')
		          .content('Confirm you want to remove the task ' + task.index() + '.- ' + name)
		          .ariaLabel('Remove ' + name)
		          .targetEvent(event)
		          .ok('Confirm removal')
		          .cancel("Don't do it!");
			    $mdDialog.show(confirm).then(function() {
			    	ProjectHandler.deleteTask($project, task)
			    	.then(
			    			function(task){
			    				$rootScope.$broadcast('deleteTask', task);
						    	
						    	ga('send', 'event', 'gantt', 'delete', 'task');
					    		$mdToast.show(
						                $mdToast.simple()
						                  .content("Task " + task.name() + " has been removed")
						                  .position('top right')
						                  .hideDelay(1500)
						              );
					    		
					    		deferred.resolve(task);
			    			},
			    			function(err){
					    		$mdToast.show(
						                $mdToast.simple()
						                  .content("Error deleting " + task.name())
						                  .position('top right')
						                  .hideDelay(5000)
						              );
					    		console.log("Error deleting " + task.name() + ": " + err.message);
					    		deferred.reject(err);
			    			}
			    	);
			    }, function() {
			        console.log('Removal of task ' + name + ' cancelled');
			        deferred.resolve(task);
			    });
			    
			    return deferred.promise;
			},
			addChildTask: function(parent) {
				var deferred = $q.defer();
				
				ProjectHandler.addTask($project, null, parent)
				.then (
						function(newTask){
							$mdToast.show(
					                $mdToast.simple()
					                  .content("New task added as " + parent.name() + "'s child")
					                  .position('top right')
					                  .hideDelay(1500)
					              );
							$rootScope.$broadcast('addTask', newTask);
							ga('send', 'event', 'gantt', 'create', 'task');
							
							deferred.resolve(newTask);
						},
						function(err){
							$mdToast.show(
					                $mdToast.simple()
					                  .content("Error creating new task.")
					                  .position('top right')
					                  .hideDelay(5000)
					              );
				    		console.log("Error creating new task: " + err.message);
				    		deferred.reject(err);
						});
				
				return deferred.promise;
			},
			addSiblingTaskAt: function(task, index) {
				var deferred = $q.defer();
				
				ProjectHandler.addTask($project, null, task.parent(), index)
				.then (
						function(newTask){
							$mdToast.show(
					                $mdToast.simple()
					                  .content("New task added as " + task.parent().name() + "'s child")
					                  .position('top right')
					                  .hideDelay(1500)
					              );
							$rootScope.$broadcast('addTask', newTask);
							ga('send', 'event', 'gantt', 'create', 'task');
							
							deferred.resolve(newTask);
						},
						function(err){
							$mdToast.show(
					                $mdToast.simple()
					                  .content("Error creating new task.")
					                  .position('top right')
					                  .hideDelay(5000)
					              );
				    		console.log("Error creating new task: " + err.message);
				    		deferred.reject(err);
						});
				
				return deferred.promise;
			},
			addSiblingTaskBefore: function(task) {
				return this.addSiblingTaskAt(task, task.index());
			},
			addSiblingTaskAfter: function(task) {
				var index = 0;
				if (task.isInstanceOf(SummaryTask)) {
					index = task.maxIndex() + 1;
				} else {
					index = task.index() + 1;
				}
				return this.addSiblingTaskAt(task, index);
			},
			loadProject: function() {
				
			},
			saveProject: function() {
				
			}
		}
		
	} ]);
	
});
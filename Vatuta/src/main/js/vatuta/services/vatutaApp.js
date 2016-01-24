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
			}
		}
	} ]);
	
});
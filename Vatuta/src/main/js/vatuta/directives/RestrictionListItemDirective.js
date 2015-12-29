define(["vatuta/vatutaApp"], function() {
	
	angular.module('vatutaApp').directive('restrictionListItem', ['$mdDialog', '$mdToast', function($mdDialog, $mdToast) {
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
});
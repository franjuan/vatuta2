define([ "vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').controller('ViewSelectorController', ['$scope', '$location', function($scope, $location) {
		this.isOpen = false;
		
		$scope.go = function ( path ) {
			  $location.path( path );
			};
		
		}]);
});
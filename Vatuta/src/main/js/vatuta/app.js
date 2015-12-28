require([ "vatuta/services"], function(vatuta) {
	angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages','ngSanitize','ngCookies', 'vatuta' ]);
});
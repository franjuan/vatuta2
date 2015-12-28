define([ "vatuta/services/vatuta"], function(vatuta) {
	return angular.module('vatutaApp', [ 'ngMaterial', 'ngMessages','ngSanitize','ngCookies', 'ngAnimate', 'vatuta' ]);
});
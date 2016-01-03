define(["vatuta/vatutaApp"], function() {
	angular.module('vatutaApp').filter('duration', [function() {
		return function(input, longFormat, defaultValue) {
			if (input) {
				return longFormat ? input.formatter() : input.shortFormatter();
			} else {
				return defaultValue ? defaultValue : "";
			}
		};
	}]);
});
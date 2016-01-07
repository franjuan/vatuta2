define(["moment", "vatuta/vatutaApp"], function(moment) {
	angular.module('vatutaApp').filter('moment', [function() {
		return function(input, format, defaultValue) {
			if (input) {
				if (moment.isMoment(input)) {
					return input.format(format?format:"DD-MM-YYYY");  
				} else if (moment.isDate(input)) {
					return moment(input).format(format?format:"DD-MM-YYYY");
				} else {
					return input;
				}
			} else {
				return defaultValue ? defaultValue : "";
			}
		};
	}]);
});
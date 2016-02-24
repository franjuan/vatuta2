define(["lodash", "vatuta/vatutaApp"], function(_) {
	angular.module('vatutaApp').filter('time', [function() {
		return function(input, hours12, defaultValue) {
			if (input) {
				return (input.hours ?
							((hours12 ?
								(input.hours>=13 ?
									(input.hours - 12) :
									(input.hours<1 ?
										input.hours + 12 :
										input.hours)) :
								input.hours) + ":") :
							"--:") + 
						(input.minutes ?
							_.padLeft(input.minutes, 2, "0") :
							"00") +
						(input.seconds ?
							(":" + _.padLeft(input.seconds, 2, "0")) :
							"") +
						(hours12 ?
							input.hours>=12 ? " PM": " AM" :
							"");
			} else {
				return defaultValue ? defaultValue : "";
			}
		};
	}]);
});
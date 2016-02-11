define([  "vatuta/shared/Duration", "vatuta/shared/Tactics", "moment", "vatuta/vatutaApp"  ],
function(Duration, Tactics, moment) {
	angular
		.module('vatutaApp')
		.controller('CalendarController',
			[	'$scope',
				'$mdDialog',
				'$mdToast',
				'$project',
				function($scope, $mdDialog, $mdToast, $project) {
					$scope.columns = 4;
					$scope.rows = 3;
					$scope.getSequence = function(num) {
						var result = [];
						for(var i=0; i<num; i++) {
					         result.push(i);
					    }
					    return result;   
					}
					
					$scope.moment = moment;
					$scope.getWeekDays = function() {
						return moment.weekdaysMin();
					}
				
					
				} ]);
});
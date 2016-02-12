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
					
					$scope.weeks = function(year, month) {
						var init = moment({ years:year, months:month-1, date:1}).startOf("week");
						var end = moment({ years:year, months:month-1, date:1}).endOf("month");
						return Math.ceil(end.diff(init,"weeks",true));
					}
					
					$scope.day = function(year, month, week, weekDay) {
						var day = moment({ years:year, months:month-1, date:1}).startOf("week");
						day.add(week, "weeks");
						day.add(weekDay - 1, "days");
						return day;
					}
				} ]);
});
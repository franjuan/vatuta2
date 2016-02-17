define([  "vatuta/shared/Duration", "vatuta/shared/Tactics", "moment", "vatuta/vatutaApp"  ],
function(Duration, Tactics, moment) {
	angular
		.module('vatutaApp')
		.controller('CalendarController',
			[	'$scope',
				'$mdDialog',
				'$mdToast',
				'$project',
				'$window',
				function($scope, $mdDialog, $mdToast, $project, $window) {
					$scope.project = $project;
					
					$scope.timetables = [{id:1, name:'Base'},{id:2, name:'Convenio'},{id:3,name:'Special'}];
					$scope.timetable = $scope.timetables[0];
					
					$scope.year = moment().year();
				
					$scope.columns = Math.floor($window.innerWidth/300);
					$scope.columns = $scope.columns > 4?4:$scope.columns;
					$scope.rows = 12/$scope.columns;
					
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
					
					this.onChangeYear = function(event,year) {
						$scope.year = year;
					}
					$scope.$on('changeYear', this.onChangeYear);
				} ]);
});
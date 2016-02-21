define(["moment", "vatuta/vatutaApp"  ],
function(moment) {
	angular
		.module('vatutaApp')
		.controller('CalendarController',
			[	'$scope',
				'$mdDialog',
				'$mdToast',
				'$project',
				'$window',
				'$mdSidenav',
				function($scope, $mdDialog, $mdToast, $project, $window, $mdSidenav) {
					$scope.project = $project;
					
					$scope.timetables = [{name:'Base',
										  color: '#C5CAE9',
										  intervals:[
										             {weekday:[false,true,true,true,true,false,false],
										             ranges:[{from:'8:00',to:'13:00'},
										                     {from:'14:00',to:'17:00'}
										                     ]},
								                     {weekday:[false,false,false,false,false,true,false],
										             ranges:[{from:'8:00',to:'15:00'}
										                     ]},
								                     {weekday:[true,false,false,false,false,false,true],
											             ranges:[]}
										             ]},
					                     {name:'Summer',
										  color: '#FFA000',
										  intervals:[
										             {weekday:[false,true,true,true,true,true,false],
										             ranges:[{from:'8:00',to:'15:00'}
										                     ]},
								                     {weekday:[true,false,false,false,false,false,true],
											             ranges:[]}
										             ]},
					                     {name:'Vacation',
										  color: '#FF5252',
										  intervals:[
								                     {weekday:[true,true,true,true,true,true,true],
											             ranges:[]}
										             ]}];
					$scope.indexTimetables = 0;
					
					$scope.year = moment().year();
				
					$scope.columns = Math.floor($window.innerWidth/300);
					$scope.columns = Math.min(4,$scope.columns);
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
					
					$scope.editTimeTable = function(timetable, $event) {
						$mdSidenav('left').toggle();
					}
					
					$scope.addTimeTable = function($event) {
						
					}
					
					$scope.removeTimeTable = function(timetable, $event) {
						
					}
				} ]);
});
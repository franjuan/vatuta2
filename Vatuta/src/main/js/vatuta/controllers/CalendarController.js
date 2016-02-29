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
				'CalendarHandler',
				function($scope, $mdDialog, $mdToast, $project, $window, $mdSidenav, CalendarHandler) {
					$scope.project = $project;
					
					$scope.timetables = [{id: 1,
										  name:'Base',
										  description: '',
										  color: '#C5CAE9',
										  intervals:[
										             {weekday:[false,true,true,true,true,false,false],
										             ranges:[{from:{hours:8, minutes:0}, to:{hours:13,minutes:0}},
										                     {from:{hours:14, minutes:0}, to:{hours:17,minutes:0}}
										                     ]},
								                     {weekday:[false,false,false,false,false,true,false],
										             ranges:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
										                     ]},
								                     {weekday:[true,false,false,false,false,false,true],
											             ranges:[]}
										             ]},
					                     {id:2,
										  name:'Summer',
										  description: '',
										  color: '#FFA000',
										  intervals:[
										             {weekday:[false,true,true,true,true,true,false],
										             ranges:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
										                     ]},
								                     {weekday:[true,false,false,false,false,false,true],
											             ranges:[]}
										             ]},
					                     {id:3,
										  name:'Vacation',
										  description: '',
										  color: '#FF5252',
										  intervals:[
								                     {weekday:[true,true,true,true,true,true,true],
											             ranges:[]}
										             ]}];
//					$scope.calendar = {
//							tree: 	{	isBranch:true,
//										lowDate: moment([2016,6,1]),
//										highDate: moment([2016,8,1]),
//										lowChild: {isLeaf:true, timetable:$scope.timetables[0]},
//										middleChild: {isLeaf:true, timetable:$scope.timetables[1]},
//										highChild: {isLeaf:true, timetable:$scope.timetables[0]}
//										
//									}
//					};
					
					$scope.calendar = {
							tree: {isLeaf: true, timetable:$scope.timetables[0]}
					};
					
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
					
					$scope.getBackGroundColor = function(date) {
						return CalendarHandler.searchTimeTable(date, $scope.calendar).color;
					}
					
					$scope.clickOnDay = function(date) {
						CalendarHandler.changeDay(date, $scope.calendar, $scope.timetables[$scope.indexTimetables]);
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
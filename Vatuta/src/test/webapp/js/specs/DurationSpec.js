require([ "moment", "vatuta/services/duration", "vatuta/services/calendar"],
		function(Moment) {
	describe("Duration Calculations", function () {
		beforeEach(function() {
			module('vatuta');
		});
		
	    it("Services loading", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
    	
            expect(DurationHandler).not.toBeNull();
            expect(CalendarHandler).not.toBeNull();
	    }));
	});
	
	describe("Actual Start Calculations", function () {
		var calendar;
		
		beforeAll(function() {
			calendar = {
					timetables:  [{id: 1,
								  name:'Base',
								  description: '',
								  color: '#C5CAE9',
								  period: {units:'week', value: 1},
								  increment: {units:'day', value: 1},
								  slices:[
								             {sliceSelector:[false,true,true,true,true,false,false],
								             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:13,minutes:0}},
								                     {from:{hours:14, minutes:0}, to:{hours:17,minutes:0}}
								                     ]},
						                     {sliceSelector:[false,false,false,false,false,true,false],
								             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
								                     ]},
						                     {sliceSelector:[true,false,false,false,false,false,true],
									             workingTimes:[]}
								             ]},
			                     {id:2,
								  name:'Summer',
								  description: '',
								  color: '#FFA000',
								  period: {units:'week', value: 1},
								  increment: {units:'day', value: 1},
								  slices:[
								             {sliceSelector:[false,true,true,true,true,true,false],
								             workingTimes:[{from:{hours:8, minutes:0}, to:{hours:15,minutes:0}}
								                     ]},
						                     {sliceSelector:[true,false,false,false,false,false,true],
									             workingTimes:[]}
								             ]},
			                     {id:3,
								  name:'Vacation',
								  description: '',
								  color: '#FF5252',
								  period: {units:'week', value: 1},
								  increment: {units:'day', value: 1},
								  slices:[
						                     {sliceSelector:[true,true,true,true,true,true,true],
									             workingTimes:[]}
								             ]}]};
			calendar.tree = 		
					{	isBranch:true,
						lowDate: Moment([2016,6,1]),
						highDate: Moment([2016,7,1]),
						lowChild: {isLeaf:true, timetable:calendar.timetables[0]},
						middleChild: {isLeaf:true, timetable:calendar.timetables[1]},
						highChild: {
							isBranch:true,
							lowDate: Moment([2016,8,1]),
							highDate: Moment([2016,8,1]),
							lowChild: {isLeaf:true, timetable:calendar.timetables[2]},
							highChild: {isLeaf:true, timetable:calendar.timetables[0]}
						}
						
					};
		});
		
		beforeEach(function() {
			module('vatuta');
		});
		
	    it("Services loading", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
    	
            expect(DurationHandler).not.toBeNull();
            expect(CalendarHandler).not.toBeNull();
	    }));
	    
	    it("Midnight start in Winter", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 1, 1]), calendar);
            expect(start.isSame(Moment([2016, 1, 1, 8, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Midnight start in Summer", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 6, 5]), calendar);
            expect(start.isSame(Moment([2016, 6, 5, 8, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Midnight start in Holidays", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 7, 5]), calendar);
            expect(start.isSame(Moment([2016, 8, 1, 8, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Midday start in Winter", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 1, 1, 12, 00]), calendar);
            expect(start.isSame(Moment([2016, 1, 1, 12, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Midday start in Summer", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 6, 5, 12, 00]), calendar);
            expect(start.isSame(Moment([2016, 6, 5, 12, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Midday start in Holidays", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 7, 5, 12, 00]), calendar);
            expect(start.isSame(Moment([2016, 8, 1, 8, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Afternoon start in Winter", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 1, 1, 16, 00]), calendar);
            expect(start.isSame(Moment([2016, 1, 1, 12, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Afternoon start in Summer", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 6, 5, 16, 00]), calendar);
            expect(start.isSame(Moment([2016, 6, 6, 8, 0]),'minutes')).toBeTruthy();
	    }));
	    
	    it("Afternoon start in Holidays", inject(function(DurationHandler, CalendarHandler){ //parameter name = service name
            var start = DurationHandler.upcomingWorkingTime(Moment([2016, 7, 5, 16, 00]), calendar);
            expect(start.isSame(Moment([2016, 8, 1, 8, 0]),'minutes')).toBeTruthy();
	    }));
	});
});
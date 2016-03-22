require([ "moment", "vatuta/services/duration"],
		function(Moment) {
	describe("Duration Calculations", function () {
		beforeEach(function() {
			module('vatuta');
		});
		
	    it("Services loading", inject(function(DurationHandler){ //parameter name = service name
    	
            expect(DurationHandler).not.toBeNull();
	    }));
	});
	
	describe("AddTo Calculations", function () {
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
	    
	    xit("Add 5 days", inject(function(DurationHandler){ //parameter name = service name
            var d = DurationHandler.addTo(Moment([2016,2,21]), {'days':5}, calendar);
            expect(d.end.isSame(Moment([2016, 2, 26]),'days')).toBeTruthy();
	    }));
	    
	    it("Add 10 hours", inject(function(DurationHandler){ //parameter name = service name
            var d = DurationHandler.addTo(Moment([2016,2,21]), {'hours':10}, calendar);
            expect(d.end.isSame(Moment([2016, 2, 22, 10, 00]),'hours')).toBeTruthy();
	    }));
	    
	    it("Add 10 hours with a weekend", inject(function(DurationHandler){ //parameter name = service name
            var d = DurationHandler.addTo(Moment([2016,2,25]), {'hours':10}, calendar);
            expect(d.end.isSame(Moment([2016, 2, 28, 11, 00]),'hours')).toBeTruthy();
	    }));
	    
	    it("Add 10 hours with holidays", inject(function(DurationHandler){ //parameter name = service name
            var d = DurationHandler.addTo(Moment([2016,6,29]), {'hours':10}, calendar);
            expect(d.end.isSame(Moment([2016, 8, 1, 11, 00]),'hours')).toBeTruthy();
	    }));
	});
	
});
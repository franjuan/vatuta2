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
});
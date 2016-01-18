require(["vatuta/services/vatuta"],
		function() {	
	describe("Serializarion & Deserialization of Projects", function () {
		beforeEach(function() {
			module('vatuta')
		});
		
	    it("Serializarion & Deserialization", inject(function(ProjectSerializer){ //parameter name = service name
    	
            expect(ProjectSerializer).not.toBeNull()
	    	
	    }));
	});
});
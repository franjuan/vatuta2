describe("the sample spec", function () {
 
	beforeEach(function(){
	});
 
    it("must be valid", function () {
        expect("OK").toBe("OK");
    });
    
    it("must be invalid", function () {
        expect("OK").toBe("NO");
    });
});
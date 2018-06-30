describe("Loosely Goosed HTML Template", function() {
	beforeEach(() => {
		cy.visit("http://localhost:1234/");
	});

	it("the test page loads", () => {
		cy.contains("template");
	});

	it("Renders the example articles", () => {
		cy.contains("Introduction");
		cy.contains("Advantages");
		cy.contains("Drawbacks");
		cy.contains("Conclusion");
	});
});

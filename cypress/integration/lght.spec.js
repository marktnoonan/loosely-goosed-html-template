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

	it("Renders a new aricle", () => {
		cy.window().then(win => {
			win.lght.addContentToTarget({
				templateSelector: "#article-template",
				targetSelector: "#article",
				templateData: {
					title: "Hello There",
					text: "This is some text.",
					anotherThing: "Here is the other thing.",
					aNumber: Math.floor(Math.random() * 100 + 1),
					ipsum: Date.now()
				}
			});
		});
		cy.contains("Hello There");
		cy.contains("Here is the other thing.");
	});
});

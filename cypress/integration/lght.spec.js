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

  it("Renders a new aricle with all acceptable property types", () => {
    cy.window().then(win => {
      win.lght.addContentToTarget({
        templateSelector: "#article-template",
        targetSelector: "#article",
        templateData: {
          title: "Hello There",
          anotherThing: ["array", "test"].join(""),
          aNumber: 4000,
          ipsum: true
        }
      });
    });
    cy.contains("Hello There");
    cy.contains("4000");
    cy.contains("true");
  });

  it("throws an error when trying to interpolate an object or array", () => {
    cy.window().then(win => {
      expect(() => {
        win.lght.addContentToTarget({
          templateSelector: "#article-template",
          targetSelector: "#article",
          templateData: {
            title: ["Hello There"]
          }
        });
      }).to.throw();
    });
  });
});

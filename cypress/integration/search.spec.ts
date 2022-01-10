/// <reference types="cypress" />
describe("Search feature", () => {
  const searchQuery = "Blouse";

  beforeEach(() => {
    cy.visit("/index.php");
  });

  it("User can search for an item", () => {
    cy.get("#search_query_top").type(`${searchQuery}{enter}`);
    cy.get("span.heading-counter")
      .invoke("text")
      .then((text) => {
        cy.wrap(parseInt(text.match(/\d+/g)[0])).should("be.gt", 0);
      });
    cy.get(".product-image-container img")
      .invoke("attr", "title")
      .should("contain", `${searchQuery}`);
  });
  it("should see warning message for no results", () => {
    cy.get("#search_query_top").type("{enter}");
    cy.get("span.heading-counter")
      .invoke("text")
      .then((text) => {
        cy.wrap(parseInt(text.match(/\d+/g)[0])).should("eq", 0);
      });
    cy.contains(".alert-warning", "Please enter a search keyword").should(
      "be.visible"
    );
  });
});

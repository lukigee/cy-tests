/// <reference types="cypress" />

describe("Core elements visibility", () => {
  const user = Cypress.env("user");

  context("Given the user is on home page", () => {
    before(() => {
      cy.login(user);
      cy.visit("/index.php");
    });
    it("should see core elements of the home page", () => {
      const elementsSelectors = [
        "#block_top_menu",
        "#header",
        "#search_block_top",
        ".shopping_cart",
        "#homepage-slider",
        "#center_column",
        "#homefeatured",
        "#htmlcontent_home",
        "#footer",
      ];
      elementsSelectors.forEach((element) =>
        cy.get(element).should("be.visible")
      );
      // check tabs visibility
      ["Women", "Dresses", "T-shirts"].map((tabName) =>
        cy.contains(".sf-menu > li > a", tabName).should("be.visible")
      );
    });
  });
});

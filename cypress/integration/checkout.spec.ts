/// <reference types="cypress" />

describe("Checkout feature", () => {
  const user = Cypress.env("user");
  context("Given the user is logged in", () => {
    before(() => {
      cy.login(user);
      cy.visit("/index.php");
      cy.addItemtoCart(5);
    });
    it("can complete checkout process using bank wire paymant option", () => {
      cy.get(".shopping_cart > a").click();
      cy.contains(".cart_navigation span", "Proceed to checkout").click();
      cy.contains(".step_current", "Address").then(() => {
        cy.contains(".cart_navigation span", "Proceed to checkout").click();
      });
      cy.contains(".step_current", "Shipping").then(() => {
        cy.get("#cgv").click();
        cy.contains(".cart_navigation span", "Proceed to checkout").click();
      });
      cy.contains(".step_current", "Payment").then(() => {
        cy.contains("a.bankwire", "Pay by bank wire").click();
        cy.contains("button.button", "I confirm my order").click();
      });
      cy.contains(".page-heading", "Order confirmation").should("be.visible");
      cy.contains(".cart_navigation a", "Back to orders").should("be.visible");
    });
  });
});

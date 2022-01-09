/// <reference types="cypress" />
describe("Login feature", () => {
  before(() => {
    cy.visit("/");
  });

  it("user login to the app", () => {
    cy.get("a.login").click();
    cy.get("[name=email]").first().type("test-cy2@yopmail.com");
    cy.get("[name=passwd]").first().click().type("123445");
    cy.get("[name=SubmitLogin]").click();
    cy.contains(".header_user_info", "test test").should("exist");
    cy.location().should((loc) => {
      expect(loc.search).to.eq("?controller=my-account");
    });
  });
  context("Given the user is logged in", () => {
    it("can log");
  });
});

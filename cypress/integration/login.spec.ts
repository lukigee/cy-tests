/// <reference types="cypress" />
describe("Login feature", () => {
  context("Given the user is registered", () => {
    it("can log in to the app", () => {
      cy.visit("/index.php");
      cy.get("a.login").click();
      cy.get("[name=email]").first().type("test-cy2@yopmail.com");
      cy.get("[name=passwd]").first().click().type("123445");
      cy.get("[name=SubmitLogin]").click();
      cy.contains(".header_user_info", "test test").should("exist");
      cy.location().should((loc) => {
        expect(loc.search).to.eq("?controller=my-account");
      });
    });
  });
  context("Given the user is logged in", () => {
    before(() => {
      cy.fixture("user.json").as("user");
      cy.get<{ email: string; password: string }>("@user").then(
        ({ email, password }) => {
          cy.login({ email, password });
        }
      );
      cy.visit("/index.php");
    });
    it("can log out", () => {
      cy.get("a.logout").click();
      cy.contains("#contact-link", "Contact us").should("be.visible");
      cy.contains("a.login", "Sign in").should("be.visible");
    });
  });
});

/// <reference types="cypress" />

function calculateTotalPrice({
  price_float,
  shippingCostFloat,
  total_tax,
  numOfItems,
}: {
  price_float: number;
  shippingCostFloat: number;
  total_tax: number;
  numOfItems: number;
}): string {
  return `$${(price_float * numOfItems + shippingCostFloat + total_tax).toFixed(
    2
  )}`;
}

describe("Cart feature", () => {
  const user = Cypress.env("user");
  context("Given the user has no items in the cart", () => {
    before(() => {
      cy.login(user);
      cy.visit("/index.php");
    });
    it("can add item to the cart", () => {
      cy.get("ul > li > .product-container")
        .eq(3)
        .within(() => {
          cy.get(".product-name").invoke("text").as("productName");
          cy.get(".price.product-price").eq(0).invoke("text").as("price");
          cy.get('[title="Add to cart"]').click();
        });
      cy.get("#layer_cart", { timeout: 15000 }).should("be.visible");
      cy.get(".shopping_cart > a").click({ force: true });
      cy.get(".cart_description a")
        .eq(0)
        .invoke("text")
        .should(function ($text: string) {
          expect($text).to.be.equal(this.productName.trim());
        });

      cy.get("#total_product")
        .invoke("text")
        .should(function ($text) {
          expect($text).to.be.equal(this.price.trim());
        });
    });
  });
  context("Given the user has already an item in the cart", () => {
    beforeEach(() => {
      cy.login(user);
      cy.visit("/index.php");
    });
    it("can increase quantity by clicking add button", () => {
      cy.addItemtoCart(3).then(($product) => {
        cy.wrap(JSON.parse($product).products[0].price_float).as("price_float");
        cy.wrap(JSON.parse($product).shippingCostFloat).as("shippingCostFloat");
      });
      cy.intercept("POST", "/*").as("addItemToCart");
      cy.get(".shopping_cart > a").click();
      cy.get("[id*=cart_quantity_up]").click();
      cy.wait("@addItemToCart").then(({ response: { body } }) => {
        cy.get("#total_price")
          .invoke("text")
          .should(function ($price) {
            const {
              summary: { total_tax },
              nbTotalProducts,
            } = JSON.parse(body);

            expect($price).to.be.equal(
              calculateTotalPrice({
                price_float: this.price_float,
                shippingCostFloat: this.shippingCostFloat,
                total_tax,
                numOfItems: nbTotalProducts,
              })
            );
          });
      });
    });
    it("can remove item from the cart", () => {
      cy.addItemtoCart(3);
      cy.get(".shopping_cart > a").click();
      cy.get("[data-title=Delete]").click();
      cy.contains(
        ".alert.alert-warning",
        "Your shopping cart is empty."
      ).should("be.visible");
    });
  });
});

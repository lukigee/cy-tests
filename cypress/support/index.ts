// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

interface ILogin {
  email: string;
  password: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command which helps login without needing to actually use UI
       * @example cy.login('test@example.com','strong password')
       */
      login({ email, password }: ILogin): void;
    }
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command which helps to add product to the cart programatically
       * @example cy.addItemtoCart(1)
       */
      addItemtoCart(productId: number): Chainable<any>;
    }
  }
}

Cypress.Commands.add("login", ({ email, password }) => {
  cy.log(email);
  cy.request({
    url: "/index.php?controller=authentication",
    body: {
      email,
      passwd: password,
      back: "my-account",
      SubmitLogin: "",
    },
    method: "POST",
    form: true,
  }).then(({ headers }) => {
    const cookies = headers["set-cookie"] as string[];
    if (!cookies) {
      return;
    }
    const [nameAndvalue] = cookies[0].split(";");
    const [name, value] = nameAndvalue.split("=");

    cy.setCookie(name, value).then(({ domain }) => cy.log(domain));
  });
});

Cypress.Commands.add("addItemtoCart", (productId) => {
  cy.window().then((win) => {
    cy.request({
      url: "/index.php?rand=1641843135054",
      body: {
        controller: "cart",
        add: 1,
        ajax: true,
        qty: 1,
        id_product: productId,
        token: win.globalThis.static_token,
      },
      method: "POST",
      form: true,
    }).then(({ body }) => {
      cy.reload();
      return cy.wrap(body);
    });
  });
});

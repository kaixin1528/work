describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("user inputs correct credentials after entering incorrect credentials", () => {
    cy.get('[data-test="account"]')
      .type("some value")
      .should("have.value", "some value")
      .get('[data-test="email"]')
      .type(Cypress.env("email"))
      .should("have.value", Cypress.env("email"))
      .get('[data-test="password"]')
      .type(Cypress.env("password"))
      .should("have.value", Cypress.env("password"))
      .get('[data-test="submit"]')
      .click()
      .get('[data-test="incorrect-credentials"]');

    cy.get('[data-test="account"]')
      .clear()
      .type(Cypress.env("account_alias"))
      .should("have.value", Cypress.env("account_alias"))
      .get('[data-test="submit"]')
      .click()
      .url()
      .should("contain", "/graph");
  });

  it("signin button is disabled if not all credentials are entered", () => {
    cy.get('[data-test="account"]')
      .type(Cypress.env("account_alias"))
      .get('[data-test="email"]')
      .type(Cypress.env("email"))
      .get('[data-test="submit"]')
      .should("be.disabled");
  });
});

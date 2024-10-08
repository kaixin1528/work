/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): void;
    dashboard(): void;
  }
}

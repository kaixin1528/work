describe("Dahboard Page", () => {
  beforeEach(() => {
    cy.login();
    cy.dashboard();
  });

  it("dashboard shows correct number of widgets for each cloud", () => {
    cy.visit("/dashboard")
      .wait(500)
      .get('[data-test="aws-widgets"]')
      .children()
      .should("have.length", 6)
      .get('[data-test="gcp-widgets"]')
      .children()
      .should("have.length", 6);
  });

  it("widget preview components are present", () => {
    cy.visit("/dashboard");

    cy.get('[data-test="aws-vpc"]')
      .should("have.length", 3)
      .get('[data-test="aws-group"]')
      .should("have.length", 4)
      .get('[data-test="aws-inference"]')
      .should("have.length", 3)
      .get('[data-test="aws-gauge"]')
      .get('[data-test="aws-regions"]')
      .get('[data-test="aws-most-used-firewall"]')
      .should("have.length", 3)
      .get('[data-test="aws-recent-firewall"]')
      .children()
      .should("have.length", 2)
      .get('[data-test="aws-ingress-egress"]')
      .children()
      .should("have.length", 2);

    cy.get('[data-test="gcp-vpc"]')
      .should("have.length", 3)
      .get('[data-test="gcp-group"]')
      .should("have.length", 4)
      .get('[data-test="gcp-inference"]')
      .should("have.length", 3)
      .get('[data-test="gcp-gauge"]')
      .get('[data-test="gcp-regions"]')
      .get('[data-test="gcp-most-used-firewall"]')
      .should("have.length", 3)
      .get('[data-test="gcp-recent-firewall"]')
      .children()
      .should("have.length", 2)
      .get('[data-test="gcp-ingress-egress"]')
      .children()
      .should("have.length", 2);
  });
});

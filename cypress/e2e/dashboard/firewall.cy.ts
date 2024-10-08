describe("Firewall Page", () => {
  beforeEach(() => {
    cy.login();
    cy.dashboard();
    cy.intercept("GET", "**/filter/autocomplete/query_params*", {
      fixture: "dashboard/firewall/autocomplete-params.json",
    })
      .intercept("POST", "**/filter/autocomplete/*", {
        fixture: "dashboard/firewall/autocomplete-values.json",
      })
      .intercept("GET", "**/firewall/graph*", {
        fixture: "dashboard/firewall/graph.json",
      });
  });

  it("graph renders correctly", () => {
    cy.visit("/dashboard")

      .get('[data-test="sg-preview"]')
      .click()

      .get('[data-test="sg-graph"]');

    cy.visit("/dashboard")

      .get('[data-test="gf-preview"]')
      .click()

      .get('[data-test="gf-graph"]');
  });

  it("reset graph functions correctly", () => {
    cy.visit("/dashboard")
      .get('[data-test="sg-preview"]')
      .click()
      .get('[data-test="firewall-autocomplete"]')
      .type("node_type:VPC")
      .get('[data-test="aws-reset-firewall"]')
      .click()
      .get('[data-test="firewall-autocomplete"]')
      .should("have.value", "");

    cy.visit("/dashboard")
      .get('[data-test="gf-preview"]')
      .click()
      .get('[data-test="firewall-autocomplete"]')
      .type("node_type:VPC")
      .get('[data-test="gcp-reset-firewall"]')
      .click()
      .get('[data-test="firewall-autocomplete"]')
      .should("have.value", "");
  });

  it("autocomplete functions correctly on click, type, and key press", () => {
    cy.visit("/dashboard").get('[data-test="sg-preview"]').click();
    cy.get('[data-test="firewall-autocomplete"]')
      .click()
      .get('[data-test="firewall-query-params"]')
      .should("be.visible")
      .click(60, 45)
      .get('[data-test="firewall-autocomplete"]')
      .type("df{enter}")
      .intercept(
        {
          method: "GET",
          url: "**/firewall_graph/search/*",
          query: { query_string: "node_type:df" },
        },
        { status: 404, body: "not found" }
      )
      .get('[data-test="firewall-autocomplete"]')
      .should("have.value", "node_type:df")
      .and("have.class", "dark:text-white");

    cy.get('[data-test="clear-query"]')
      .click()
      .get('[data-test="firewall-autocomplete"]')
      .click()
      .type("{downarrow}{enter}")
      .click()
      .type("{enter}")
      .intercept(
        {
          method: "GET",
          url: "**/firewall_graph/search/*",
          query: { query_string: "node_type:" },
        },
        { status: 404, body: "not found" }
      )
      .get('[data-test="firewall-autocomplete"]')
      .should("have.value", "node_type:")
      .and("have.class", "dark:text-white")
      .type("SG")
      .click()
      .type("{enter}")
      .intercept(
        {
          method: "GET",
          url: "**/firewall_graph/search/*",
          query: { query_string: "node_type:SG" },
        },
        { fixture: "dashboard/firewall/graph.json" }
      )
      .get('[data-test="firewall-autocomplete"]')
      .should("have.value", "node_type:SG");
  });
});

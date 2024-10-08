describe("Evolution Section", () => {
  beforeEach(() => {
    cy.login();
    cy.intercept("GET", "**/notifications", {
      fixture: "general/notifications.json",
    })
      .intercept("GET", "**/cloudprovider", {
        fixture: "dashboard/active-clouds.json",
      })
      .intercept("GET", "**/graph/timestamps*", {
        fixture: "graph/timestamps.json",
      })
      .intercept("GET", "**/graph/search/autocomplete/query_params", {
        fixture: "graph/autocomplete/query-params.json",
      })
      .intercept("POST", "**/graph/search/autocomplete/*", {
        fixture: "graph/autocomplete/query-values.json",
      });
    cy.intercept("POST", "**/graph/subgraph", (req) => {
      req.body = {
        node_id: "unoai_cloudsensor:v0.0.11",
        depth: "0",
        only_show_agg: false,
        timestamp: 1660006800000000,
      };

      req.reply({ fixture: "graph/subgraph.json" });
    })
      .intercept("GET", "**/graph/diff/summary?bucket_size=month", {
        fixture: "graph/evolution/month-chart.json",
      })
      .intercept("GET", "**/graph/diff/summary?bucket_size=day*", {
        fixture: "graph/evolution/day-chart.json",
      })
      .intercept("GET", "**/graph/diff/summary?bucket_size=hour*", {
        fixture: "graph/evolution/hour-chart.json",
      });
  });

  it("evolution chart navigates and renders diff graph correctly", () => {
    cy.visit("/graph/*");

    cy.get('[data-test="evolution"]')
      .click()
      .get('[data-test="view"]')
      .should("have.text", "By month")
      .get('[data-test="evolution-chart"]')
      .click()
      .click()
      .get('[data-test="view"]')
      .should("have.text", "By hour")
      .get('[data-test="evolution-chart"]')
      .click()
      .intercept("GET", "**/graph/diff/1656543600000000", {
        fixture: "graph/evolution/graph.json",
      })
      .get('[data-test="subgraph"]')
      .get('[data-test="minimap"]')
      .get('[data-test="evolution-chart"]')
      .click()
      .get('[data-test="subgraph"]')
      .get('[data-test="minimap"]');
  });

  it("reset graph functions correctly for evolution", () => {
    cy.visit("/graph/*");

    cy.get('[data-test="evolution"]')
      .click()
      .get('[data-test="evolution-chart"]')
      .click()
      .click()
      .get('[data-test="reset-graph"]')
      .click()
      .get('[data-test="view"]')
      .should("have.text", "By month");
  });
});

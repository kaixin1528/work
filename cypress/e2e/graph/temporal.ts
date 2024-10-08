describe("Temporal Section", () => {
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

  it("temporal query renders query result correctly", () => {
    cy.visit("/graph/*");

    cy.get('[data-test="temporal-search"]')
      .click()
      .get('[data-test="temporal-lottie"]')
      .get('[data-test="graph-autocomplete"]')
      .type("node_type:VPC{enter}")
      .get('[data-test="invalid"]');

    cy.get('[data-test="show-selection"]')
      .click()
      .get('[data-test="common-selection"]')
      .first()
      .click()
      .get('[data-test="search"]')
      .click()
      // .intercept("GET", "**/graph/distinct-days-within-range*", {
      //   fixture: "/graph/temporal-search/search-days.json",
      // })
      // .as("getSearchDays")
      // .wait("@getSearchDays")
      // .intercept(
      //   "GET",
      //   "**/graph/search?tz_info=UTC&query_string=node_type:VPC*",
      //   {
      //     fixture: "graph/temporal-search/query-result.json",
      //   }
      // )
      .get('[data-test="next-day"]')
      .should("be.disabled");
    // .get('[data-test="search-days"]')
    // .get('[data-test="search-snapshot"]');

    cy.get('[data-test="graph-autocomplete"]')
      .should("have.value", "node_type:VPC")
      .and("have.class", "dark:text-yellow-500")
      .get('[data-test="subgraph"]')
      .get('[data-test="search-snapshot"]')
      .first()
      .click()
      .get('[data-test="subgraph"]');

    cy.get('[data-test="graph-autocomplete"]')
      .type("{backspace}")
      .should("have.class", "dark:text-white")
      .get('[data-test="clear-query"]')
      .click()
      .get('[data-test="temporal-lottie"]');
  });

  it("autocomplete functions correctly on click, type, and key press", () => {
    cy.visit("/graph/*");

    cy.get('[data-test="graph-autocomplete"]')
      .click()
      .get('[data-test="query-params"]')
      .should("be.visible")
      .click(60, 45)
      .get('[data-test="graph-autocomplete"]')
      .type("df{enter}")
      .intercept(
        "GET",
        "**/graph/search?tz_info=UTC&query_string=node_type:df*",
        { fixture: "graph/temporal-search/empty-result.json" }
      )
      .get('[data-test="graph-autocomplete"]')
      .should("have.value", "node_type:df")
      .and("have.class", "dark:text-white");

    cy.get('[data-test="clear-query"]')
      .click()
      .get('[data-test="graph-autocomplete"]')
      .type("node_type:VPC")
      .get('[data-test="search"]')
      .click()
      .intercept(
        "GET",
        "**/graph/search?tz_info=UTC&query_string=node_type:VPC*",
        {
          fixture: "graph/temporal-search/query-result.json",
        }
      )
      .get('[data-test="graph-autocomplete"]')
      .should("have.value", "node_type:VPC")
      .and("have.class", "dark:text-yellow-500");

    cy.get('[data-test="clear-query"]')
      .click()
      .get('[data-test="graph-autocomplete"]')
      .click()
      .type("{downarrow}{enter}")
      .click()
      .type("{enter}")
      .type("df{enter}")
      .intercept(
        "GET",
        "**/graph/search?tz_info=UTC&query_string=node_type:&*",
        { fixture: "graph/temporal-search/empty-result.json" }
      )
      .get('[data-test="graph-autocomplete"]')
      .should("have.value", "node_type:df")
      .and("have.class", "dark:text-white")
      .type("{backspace}{backspace}VPC")
      .click()
      .type("{enter}")
      .intercept(
        "GET",
        "**/graph/search?tz_info=UTC&query_string=node_type:VPC*",
        {
          fixture: "graph/temporal-search/query-result.json",
        }
      )
      .get('[data-test="graph-autocomplete"]')
      .should("have.value", "node_type:VPC")
      .and("have.class", "dark:text-yellow-500");
  });

  it("reset graph functions correctly for snapshots, evolution, and temporal search", () => {
    cy.visit("/graph/*");

    cy.get('[data-test="graph-autocomplete"]')
      .type("node_type:VPC")
      .get('[data-test="reset-graph"]')
      .click()
      .get('[data-test="graph-autocomplete"]')
      .should("have.value", "");

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

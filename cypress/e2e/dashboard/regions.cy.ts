describe("Regions Page", () => {
  beforeEach(() => {
    cy.login();
    cy.dashboard();
    cy.intercept("POST", "**/regions/resource_activity/*", (req) => {
      req.body = [
        {
          field: "timestamp",
          op: "ge",
          value: 1661799493000000,
          type: "integer",
          set_op: "and",
        },
      ];

      req.reply({ fixture: "dashboard/regions/resource-counts.json" });
    });
  });

  it("region map and detail panel render correctly", () => {
    cy.visit("/dashboard")
      .get('[data-test="aws-regions"]')
      .click()
      .get('[data-test="aws-region-map"]')
      .get('[data-test="aws-region"]')
      .first()
      .click()
      .intercept("GET", "**/graph/info/*", {
        fixture: "dashboard/regions/aws/region.json",
      })
      .get('[data-test="aws-latest-resource-counts"]')
      .get('[data-test="aws-resource-counts-over-time"]');

    cy.visit("/dashboard")
      .wait(500)
      .get('[data-test="gcp-regions"]')
      .click()
      .get('[data-test="gcp-region-map"]')
      .get('[data-test="gcp-region"]')
      .first()
      .click()
      .intercept("GET", "**/graph/info/*", {
        fixture: "dashboard/regions/gcp/region.json",
      })
      .get('[data-test="gcp-latest-resource-counts"]')
      .get('[data-test="gcp-resource-counts-over-time"]');
  });
});

describe("Detail Table Page", () => {
  beforeEach(() => {
    cy.login();
    cy.dashboard();
    cy.intercept("POST", "**/infra/details/analytics*", (req) => {
      req.body = { filters: [], pager: { page_number: "1", page_size: 40 } };
      req.reply({ fixture: "/dashboard/detail-table/infra-details.json" });
    })
      .intercept("POST", "**/inference/details*", (req) => {
        req.body = { filters: [], pager: { page_number: "1", page_size: 40 } };
        req.reply({
          fixture: "/dashboard/detail-table/inference-details.json",
        });
      })
      .intercept("POST", "**/infra/details/resources*", (req) => {
        req.body = { filters: [], pager: { page_number: "1", page_size: 40 } };
        req.reply({ fixture: "/dashboard/detail-table/ecr-details.json" });
      });
  });

  it("high-level tabs render correct number of elements", () => {
    cy.visit("/dashboard")
      .get('[data-test="aws-vpc"]')
      .first()
      .click()
      .get('[data-test="aws-vpc-tabs"]')
      .should("have.length", 3);

    cy.visit("/dashboard")
      .get('[data-test="aws-group"]')
      .first()
      .click()
      .get('[data-test="aws-group-tabs"]')
      .should("have.length", 4)
      .get('[data-test="aws-second-level-tabs"]')
      .should("have.length", 4);

    cy.visit("/dashboard")
      .get('[data-test="aws-inference"]')
      .first()
      .click()
      .get('[data-test="aws-inference-tabs"]')
      .should("have.length", 3);
  });

  it("pagination functions correctly", () => {
    cy.visit("/dashboard")
      .get('[data-test="aws-group"]')
      .first()
      .click()
      .get('[data-test="prev-page"]')
      .should("be.disabled");
  });

  // it("table filter functions correctly", () => {
  //   cy.visit("/dashboard")
  //     .get('[data-test="aws-group"]')
  //     .first()
  //     .click()

  //   cy.get('[data-test="table-filter"]')
  //     .click()
  //     .get('[data-test="options"]')
  //     .first()
  //     .trigger("mouseover")
  //     .get('[data-test="option-second-level"]')
  //     .trigger("mouseover")
  //     .get("option-radio")
  //     .first()
  //     .click()
  //     .get('[data-test="option-input"]')
  //     .type("df")
  //     .get('[data-test="apply"]')
  //     .click()
  //     .get("filter-display")
  //     .get('[data-test="table-row"]')
  //     .should("have.length", 0);
  // });
});

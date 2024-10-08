Cypress.Commands.add("login", () => {
  cy.session(
    "login",
    () => {
      cy.request({
        method: "POST",
        url: "http://localhost:8080/login",
        form: true,
        body: {
          account_alias: Cypress.env("account_alias"),
          email: Cypress.env("email"),
          password: Cypress.env("password"),
        },
      }).then(({ body }) => {
        window.sessionStorage.accessToken = body.access_token;
      });
    },
    {
      validate() {
        cy.intercept("**/api/*", ({ headers }) => {
          headers["Authorization"] = `Bearer ${sessionStorage.accessToken}`;
        });
      },
    }
  );
});

Cypress.Commands.add("dashboard", () => {
  cy.session("dashboard", () => {
    cy.login();
    cy.intercept("GET", "**/notifications", {
      fixture: "general/notifications.json",
    })
      .intercept("GET", "**/cloudprovider", {
        fixture: "dashboard/active-clouds.json",
      })
      .intercept("GET", "**/infra/summary*", {
        fixture: "dashboard/summary/cloud-infra.json",
      })
      .intercept("GET", "**/inference/summary*", {
        fixture: "dashboard/summary/inference.json",
      })
      .intercept("GET", "**/data/summary*", {
        fixture: "dashboard/summary/data-flow.json",
      })
      .intercept("GET", "**/firewall_dashboard*", {
        fixture: "dashboard/summary/firewall.json",
      })
      .intercept("GET", "**/regions/activity?cloud_provider=aws", {
        fixture: "dashboard/regions/aws/activity-level.json",
      })
      .intercept("GET", "**/regions/activity?cloud_provider=gcp", {
        fixture: "dashboard/regions/gcp/activity-level.json",
      });
  });
});

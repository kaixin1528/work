import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "tq6oji",
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 100000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

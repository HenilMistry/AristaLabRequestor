const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    baseUrl: "http://localhost:8000/",
    excludeSpecPattern: [
      "**/1-getting-started/*.cy.js",
      "**/2-advanced-examples/*.cy.js"
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

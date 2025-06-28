const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    TOOL_NODE: "Node Tool",
    TOOL_CONNECTION: "Connection Tool",
    TOOL_OUTPUT: "Output Tool",
    TOOL_SETTINGS: "Settings Tool",
    TOOL_MANUAL: "User Manual",
    TOOL_ISSUE: "Report an issue",
    TEXT_LBL_INFO: "#label_info"
  },
  e2e: {
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    baseUrl: "http://localhost:8080/",
    excludeSpecPattern: [
      "**/1-getting-started/*.cy.js",
      "**/2-advanced-examples/*.cy.js"
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});

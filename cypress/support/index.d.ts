// index.d.ts
declare namespace Cypress {
  interface Chainable {
    /**
     * This custom command click on Node Tool button
     * and verifies that the label is updated.
     */
    clickOnNodeTool(): Chainable<void>;
    /**
     * This command clicks on canvas at given point 
     * (x, y) and verifies whether the NodeConfigura-
     * tionModal is visible.
     */
    clickOnCanvas(x, y): Chainable<IArguments, IArguments>;
  }
}

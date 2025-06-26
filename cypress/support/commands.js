/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * This custom command click on Node Tool button
 * and verifies that the label is updated.
 */
Cypress.Commands.add('clickOnNodeTool', () => {
    cy.get("button[title='Node Tool']").click().then(() => {
        cy.get("#label_info").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/Selected Node Tool/i)
        });
    })
});

/**
 * This command clicks on canvas at given point 
 * (x, y) and verifies whether the NodeConfigura-
 * tionModal is visible.
 */
Cypress.Commands.add('clickOnCanvas', (x, y) => {
    cy.get("canvas").should("be.visible");
    cy.get("canvas").dblclick(x, y);
    cy.get("#nodeConfigModal").should("be.visible");
})
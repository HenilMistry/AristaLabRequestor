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
 * This custom command clicks on desired tool 
 * button and verifies that the label is updated
 * if requires.
 */
Cypress.Commands.add('clickOnTool', (tool) => {
    cy.get(`button[title='${tool}']`).click().then(() => {
        cy.get("#label_info").invoke("text").then((txt) => {
            if (tool=="Node Tool") {
                expect(txt.trim()).to.match(/Selected Node Tool/i)
            } else if (tool=="Connection Tool") {
                expect(txt.trim()).to.match(/Selected Connection Tool/i)
            }
            // else do nothing...
        });
    })
});

/**
 * This custom command will verify the label.
 */
Cypress.Commands.add('verifyLabel', (regex) => {
    cy.get(Cypress.env('TEXT_LBL_INFO')).invoke("text").then((txt) => {
        expect(txt.trim()).to.match(regex);
    })
})

/**
 * This command double clicks on canvas at given point 
 * (x, y) and verifies whether the NodeConfigurationModal 
 * is visible.
 */
Cypress.Commands.add('dblClickOnCanvas', (x, y) => {
    cy.get("canvas").should("be.visible");
    cy.get("canvas").dblclick(x, y);
})

/**
 * This command single click on canvas at given point 
 * (x, y).
 */
Cypress.Commands.add('clickOnCanvas', (x, y) => {
    cy.get("canvas").should("be.visible");
    cy.get("canvas").click(x, y);
})

/**
 * This command will add a node on canvas at point
 * (x, y) with the properties given by the user.
 */
Cypress.Commands.add('addNodeOnCanvas', (x, y, type, alias, location, moveto) => {
    cy.dblClickOnCanvas(x, y);
    cy.get("#nodeConfigModal").should("be.visible");
    cy.get("#nodeType").select(type);
    cy.get("#nodeAlias").type(alias);
    cy.get("#nodeLocation").type(location);
    if (type != "IXIA") {
        if (typeof moveto === "boolean") {
            cy.get("#enableMoveTo").uncheck();
        } else {
            cy.get("#enableMoveTo").check();
            cy.get("#moveTo").type(moveto);
        }
    }
    cy.get("#nodeConfigModal > div > div > div.modal-footer > button").click().then(() => {
        cy.get("#nodeConfigModal").should("not.be.visible");
    });
})

/**
 * This custom command receives the object of nodes 
 * and prints/add all of them on canvas.
 */
Cypress.Commands.add('addNodesOnCanvas', (nodes) => {
    nodes.forEach((node) => {
        cy.addNodeOnCanvas(node.x, node.y, node.type, node.alias, node.location, node.moveto);
    });
})

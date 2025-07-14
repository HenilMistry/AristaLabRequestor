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

import { tools, nodes } from "./constants";

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
    cy.get("#nodeAlias").clear().type(alias);
    cy.get("#nodeLocation").clear().type(location);
    if (type != "IXIA") {
        if (typeof moveto === "boolean") {
            cy.get("#enableMoveTo").uncheck();
        } else {
            cy.get("#enableMoveTo").check();
            cy.get("#moveTo").clear().type(moveto);
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
    for (let node in nodes) {
        cy.addNodeOnCanvas(nodes[node].x, nodes[node].y, nodes[node].type, nodes[node].alias, nodes[node].location, nodes[node].moveto);
    }
})

/**
 * This custom command help you set-up the 
 * test for Connections Tool.
 */
Cypress.Commands.add('testSetupForConnectionsTool', () => {
    cy.clickOnTool(tools.TOOL_NODE);
    cy.addNodesOnCanvas(nodes);
    cy.clickOnTool(tools.TOOL_CONNECTION);
})

/**
 * This command will help you add the port to
 * the connection.
 */
Cypress.Commands.add('addPortToConnection', (id_a, id_b, bw) => {
    cy.get("#connectionsConfigurationModal").should("be.visible");
    cy.get("#connectionsConfig_portIdentifierA").clear().type(id_a);
    cy.get("#connectionsConfig_portIdentifierB").clear().type(id_b);
    cy.get("#connectionsConfig_bandWidth").clear().type(bw);
    cy.get("#connectionsConfig_addBtn").click();
})

/**
 * This command will receive the list of 
 * ports and add them to current connection.
 */
Cypress.Commands.add('addPortsToConnection', (ports) => {
    for (let port in ports) {
        cy.addPortToConnection(ports[port].identifier_a, ports[port].identifier_b, ports[port].bandwidth);
    }
});

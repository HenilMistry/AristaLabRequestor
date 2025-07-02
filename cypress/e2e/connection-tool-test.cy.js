import { points, nodes, tools, ports } from "../support/constants";

describe("Test cases for testing of Connection Tool", () => {

    beforeEach(() => {
        cy.visit("/");
    })

    // Test Case 01 - Should be able to select Connection Tool
    it("Checks whether the connection tool is working", () => {
        // 1) Click on "Connection Tool"
        cy.clickOnTool(tools.TOOL_CONNECTION);

        // 2) Verify the label info text
        cy.verifyLabel(/selected connection tool/i);

        // 3) Click on canvas 
        cy.clickOnCanvas(points.a.x, points.a.y);

        // 4) Verify the Alert Message appears
        cy.get("#alertModal").should("be.visible");
        cy.get("#alertModalBody").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/no nodes on the canvas/i);
        });
        cy.get("#alertModal > div > div > div.modal-footer > button").click().then(() => {
            cy.get("#alertModal").should("not.be.visible");
        });

        // 5) Verify the tool is un-selected
        cy.verifyLabel(/select some tool/i);

        // 6) Again click on canvas but this time, close the alert with "close icon"
        cy.clickOnTool(tools.TOOL_CONNECTION);
        cy.clickOnCanvas(points.b.x, points.b.y);
        cy.get("#alertModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#alertModal").should("not.be.visible");
        });
        cy.verifyLabel(/select some tool/i);
    })

    // Test Case 02 - Connection configuration modal should be working
    it("Checks whether the connection configuration modal is working", () => {
        cy.clickOnTool(tools.TOOL_NODE);

        // 1) Click on canvas to add node at point a
        // 2) Click on canvas to add node at point b
        cy.addNodesOnCanvas(nodes);

        // 3) Click on "Connection Tool"
        cy.clickOnTool(tools.TOOL_CONNECTION);

        // 4) Click on canvas at point a
        cy.clickOnCanvas(points.a.x, points.a.y);

        // 5) Click on canvas at point b
        cy.clickOnCanvas(points.b.x, points.b.y);

        // 6) Verify the Connection Configuration Modal
        cy.get("#connectionsConfigurationModalLbl").should("be.visible");
    })

    // Test Case 03 - Should be able to cancel the connection
    it("Checks whether the connection can be cancelled", () => {
        // 0) Test Setup
        cy.testSetupForConnectionsTool();
        cy.clickOnCanvas(points.a.x, points.a.y);
        cy.clickOnCanvas(points.b.x, points.b.y);

        // 1) Click on "Close button"
        cy.get("#portSelectionCancelBtn").click();

        // 2) Verify the Confirmation Message appears
        cy.get("#confirmationModal").should("be.visible");

        // 3) Click on Negative Confirmation button
        cy.get("#confirmNegativeBtn").click();

        // 4) Verify the connection configuration modal is still there
        cy.get("#confirmationModal").should("not.be.visible");
        cy.get("#connectionsConfigurationModal").should("be.visible");

        // 5) Click on "Close button" again and verify confirmation message modal
        cy.get("#portSelectionCancelBtn").click();

        // 6) Click on close icon and verify connection configuration modal
        cy.get("#confirmationModal > div > div > div.modal-header > button").click();
        cy.get("#confirmationModal").should("not.be.visible");
        cy.get("#connectionsConfigurationModal").should("be.visible");

        // 7) Click on "Close button" again and verify confirmation message modal
        cy.get("#portSelectionCancelBtn").click();

        // 8) Click on Positivr Confirmation button
        cy.get("#confirmPositiveBtn").click();

        // 9) Verify connection configuation modal is not visible
        cy.get("#connectionsConfigurationModal").should("not.be.visible");
    })

    // Test Case 04 - Should be able to add a connection port
    it("Checks whether the connection can be added", () => {
        // 0) Test Setup
        cy.testSetupForConnectionsTool();

        // 1) Verify the connection tool is still selected
        cy.clickOnTool(tools.TOOL_CONNECTION);

        // 2) Click on canvas at point a
        cy.clickOnCanvas(points.a.x, points.a.y);

        // 3) Click on canvas at point b
        cy.clickOnCanvas(points.b.x, points.b.y);

        // 4) Verify the connection configuration modal
        cy.get("#connectionsConfigurationModal").should("be.visible");

        // 5) Add a connection port
        cy.addPortsToConnection(ports);

        // 6) Verify the connection port is added
        cy.get("#connectionsConfig_connections").find("div[class='input-group mb-3']").should('have.length', Object.keys(ports).length);

    })

    // Test Case 05 - Should be able to delete a connection port

    // Test Case 06 - Should be able to edit a connection port

    // Test Case 07 - Close button of connections config modal should be working fine

    // Test Case 08 - Should be able to configure a connection

});
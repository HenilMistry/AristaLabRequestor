describe("Test cases for testing of Node Tool", () => {
   
    beforeEach(() => {
        cy.visit("/");
    })

    // Test Case 01 - Node Configuration Modal Should be showing when clicking on canvas and node tool is selected.
    it("Checks whether the Node Configuration Modal is working", () => {
        // 1) Click on "Node Tool" button and verifies that the label text is updated correctly
        cy.clickOnNodeTool();

        // 2) Click on some point on canvas and verify the Node Configuration Modal
        cy.dblClickOnCanvas(200, 300);
        cy.get("#nodeConfigModal").should("be.visible");
        cy.get("#nodeType").invoke("val").then((selectedValue) => {
            expect(selectedValue).to.match(/dut/i);
        });
        cy.get("#enableMoveTo").should("not.be.disabled");

        // 3) Click on close button to close Node Configuration Modal
        cy.get("#nodeConfigModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#nodeConfigModal").should("not.be.visible");
        })
    })

    // Test Case 02 - Changing the Node Type Dropdown should show / hide the necessary fields.
    it("Checks whether the Node Type Dropdown is working", () => {
        // 1) Click on "Node Tool" button and verifies the label
        cy.clickOnNodeTool();

        // 2) Verifies the functionality of Node Type Dropdown / Select
        cy.dblClickOnCanvas(100, 200);
        cy.get("#nodeConfigModal").should("be.visible");
        cy.get("#nodeType").select("IXIA");
        cy.get("#moveTo").should("not.be.visible");
        cy.get("#nodeType").select("DUT");
        cy.get("#moveTo").should("be.visible");

        // 3) Click on close button to close Node Configuration Modal
        cy.get("#nodeConfigModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#nodeConfigModal").should("not.be.visible");
        })
    })

    // Test Case 03 - Should be able to add and highlight a node on canvas.
    it("Checks whether the node can be added on canvas", () => {
        // 1) Click on "Node Tool" button and verifies the title...
        cy.clickOnNodeTool();

        // 2) Click on Canvas to add a node
        cy.addNodeOnCanvas(100, 300, "DUT", "node-one", "surat", "blr")

        // 3) Checks the single click and highlight
        cy.clickOnCanvas(100, 300);
        cy.get("#label_info").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/selected node : node-one/i);
        })

        // 4) Checks the single click outside the node-one 
        cy.dblClickOnCanvas(100, 600);
        cy.get("#label_info").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/Selected Node Tool/i);
        })
    })

    // Test Case 04 - Should be able to open/close Node Manager Modal when double click on node.
    it("Checks whether the Node Manager Modal is working fine", () => {
        // 1) Click on "Node Tool"
        cy.clickOnNodeTool();
        // 2) Click on canvas to add add a node
        cy.addNodeOnCanvas(100, 300, "DUT", "node-one", "surat", false);
        // 3) Double click on node to open Node Manager Modal
        cy.dblClickOnCanvas(100, 300);
        cy.get("#nodeManagerModal").should("be.visible");
        // 4) Should be able to close using close icon
        cy.get("#nodeManagerModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#nodeManagerModal").should("not.be.visible");
        });
        // 5) Should be able to open the node manager modal again
        cy.dblClickOnCanvas(100, 300);
        cy.get("#nodeManagerModal").should("be.visible");
        // 6) Should be able to close using close button
        cy.get("#nodeManagerModal > div > div > div.modal-footer > button.btn.btn-secondary").click().then(() => {
            cy.get("#nodeManagerModal").should("not.be.visible");
        })
    })

    // Test Case 05 - Should be able to delete a node from canvas
    it("Checks whether the node can be deleted from the canvas", () => {
        // 0) Verify that the confirmation modal should not be visible
        cy.get("#confirmationModal").should("not.be.visible");
        // 1) Click on "Node Tool"
        cy.clickOnNodeTool();
        // 2) Click on canvas to add a node
        cy.addNodeOnCanvas(100, 300, "DUT", "node-one", "surat", "canada");
        // 3) Double click on node to open Node Manager Modal
        cy.dblClickOnCanvas(100, 300);
        cy.get("#nodeManagerModal").should("be.visible");
        // 4) Click on Delete node button
        cy.get("#nodeManagerModal > div > div > div.modal-footer > button.btn.btn-danger").click().then(() => {
            cy.get("#confirmationModal").should("be.visible");
        });
        // 5) Do not given confirmation for deleting the node
        cy.get("#confirmNegativeBtn").click().then(() => {
            cy.get("#confirmationModal").should("not.be.visible");
            cy.get("#nodeManagerModal").should("be.visible");
        })
        // 6) Click on Delete node button and give the confirmation
        cy.get("#nodeManagerModal > div > div > div.modal-footer > button.btn.btn-danger").click().then(() => {
            cy.get("#confirmationModal").should("be.visible");
        });
        cy.get("#confirmPositiveBtn").click().then(() => {
            cy.get("#confirmationModal").should("not.be.visible");
            cy.get("#nodeManagerModal").should("not.be.visible");
        })
        // 7) Verify the node is deleted
        cy.dblClickOnCanvas(100, 300);
        cy.get("#nodeConfigModal").should("be.visible");
    })
    
});
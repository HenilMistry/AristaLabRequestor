describe("Test cases for testing of Node Tool", () => {
   
    beforeEach(() => {
        cy.visit("/");
   })

   it("Checks whether the Node Configuration Modal is working", () => {
        // 1) Click on "Node Tool" button and verifies that the label text is updated correctly
        cy.clickOnNodeTool();

        // 2) Click on some point on canvas and verify the Node Configuration Modal
        cy.clickOnCanvas(200, 300);
        cy.get("#nodeType").invoke("val").then((selectedValue) => {
            expect(selectedValue).to.match(/dut/i);
        });
        cy.get("#enableMoveTo").should("not.be.disabled");

        // 3) Click on close button to close Node Configuration Modal
        cy.get("#nodeConfigModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#nodeConfigModal").should("not.be.visible");
        })
   })

   it("Checks whether the Node Type Dropdown is working", () => {
        // 1) Click on "Node Tool" button and verifies the label
        cy.clickOnNodeTool();

        // 2) Verifies the functionality of Node Type Dropdown / Select
        cy.clickOnCanvas(100, 200);
        cy.get("#nodeType").select("IXIA");
        cy.get("#moveTo").should("not.be.visible");
        cy.get("#nodeType").select("DUT");
        cy.get("#moveTo").should("be.visible");

        // 3) Click on close button to close Node Configuration Modal
        cy.get("#nodeConfigModal > div > div > div.modal-header > button").click().then(() => {
            cy.get("#nodeConfigModal").should("not.be.visible");
        })
   })

   it("Checks whether the Node Configuration is working", () => {
    
   })

});
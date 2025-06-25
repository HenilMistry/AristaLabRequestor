describe("Test cases for testing of Node Tool", () => {
   
    beforeEach(() => {
        cy.visit("/");
   })

   it("Checks whether the Node Configuration Modal is working", () => {
        // 1) Click on "Node Tool" button and verifies that the label text is updated correctly
        cy.get("button[title='Node Tool']").click().then(() => {
            cy.get("#label_info").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/Selected Node Tool/i)
            });
        })

        // 2) Click on some point on canvas and verify the Node Configuration Modal
        cy.get("canvas").should("be.visible");
        cy.get("canvas").dblclick(200, 300);
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

});
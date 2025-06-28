describe("Test cases for testing of Connection Tool", () => {

    before(() => {
        cy.visit("/");
    })

    // Test Case 01 - Should be able to select Connection Tool
    it("Checks whether the connection tool is working", () => {
        // 1) Click on "Connection Tool"

        // 2) Verify the label info text

        // 3) Click on canvas 

        // 4) Verify the Alert Message appears

        // 5) Verify the tool is un-selected

    })

    // Test Case 02 - Connection configuration modal should be working
    it("Checks whether the connection configuration modal is working", () => {
        // 1) Click on canvas to add node at (200, 200)

        // 2) Click on canvas to add node at (400, 200)

        // 3) Click on "Connection Tool"

        // 4) Click on canvas at (200, 200)

        // 5) Click on canvas at (400, 200)

        // 6) Verify the Connection Configuration Modal
    })

    // Test Case 03 - Should be able to cancel the connection
    it("Checks whether the connection can be cancelled", () => {
        // 1) Click on "Close button"

        // 2) Verify the Confirmation Message appears

        // 3) Click on Negative Confirmation button

        // 4) Verify the connection configuration modal is still there

        // 5) Click on "Close button" again and verify confirmation message modal

        // 6) Click on close icon and verify connection configuration modal

        // 7) Click on "Close button" again and verify confirmation message modal

        // 8) Click on Positivr Confirmation button

        // 9) Verify connection configuation modal is not visible
    })

    // Test Case 04 - Should be able to add a connection
    it("Checks whether the connection can be added", () => {
        // 1) Verify the connection tool is still selected

        // 2) Click on canvas at (200, 200)

        // 3) Click on canvas at (400, 200)

        // 4) Verify the connection configuration modal

        // 5) Add a connection port

        // 6) Verify the connection port is added

        // 7) 
    })

});
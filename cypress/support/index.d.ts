// Auto-generated Cypress command types

declare namespace Cypress {

  interface Chainable {

    
    /**
    * This custom command clicks on desired tool button and verifies that the label is updated if requires.
    */
    clickOnTool(tool): Chainable<IArguments>;

    
    /**
    * This custom command will verify the label.
    */
    verifyLabel(regex): Chainable<IArguments>;

    
    /**
    * This command double clicks on canvas at given point (x, y) and verifies whether the NodeConfigurationModal is visible.
    */
    dblClickOnCanvas(x, y): Chainable<IArguments, IArguments>;

    
    /**
    * This command single click on canvas at given point (x, y).
    */
    clickOnCanvas(x, y): Chainable<IArguments, IArguments>;

    
    /**
    * This command will add a node on canvas at point (x, y) with the properties given by the user.
    */
    addNodeOnCanvas(x, y, type, alias, location, moveto): Chainable<IArguments, IArguments, IArguments, IArguments, IArguments, IArguments>;

    
    /**
    * This custom command receives the object of nodes and prints/add all of them on canvas.
    */
    addNodesOnCanvas(nodes): Chainable<IArguments>;

    
    /**
    * This custom command help you set-up the test for Connections Tool.
    */
    testSetupForConnectionsTool(): Chainable<void>;

    
    /**
    * This command will help you add the port to the connection.
    */
    addPortToConnection(id_a, id_b, bw): Chainable<IArguments, IArguments, IArguments>;

    
    /**
    * This command will receive the list of ports and add them to current connection.
    */
    addPortsToConnection(ports): Chainable<IArguments>;

  }
}
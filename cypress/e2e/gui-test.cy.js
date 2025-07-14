describe('gui-general-testing', () => {
    beforeEach(() => {
        // it visits the default URL of the application...
        cy.visit("/");
    })

    // Test Case 01 - Should be landing on the home page...
    it('Checks whether the app is landed on the home page', () => {
        cy.get("#titleOfApp").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/welcome to aristalabrequestor/i);
        });
        cy.get("#versionOfApp").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/v4.0.0/i);
        });
        cy.get("#label_info").invoke("text").then((txt) => {
            expect(txt.trim()).to.match(/select some tool to get started/i);
        });
    })

    // Test Case 02 - Node Tool should be working fine...
    it('Checks whether the node tool is working fine', () => {
        cy.get("button[title='Node Tool']").click().then(() => {
            cy.get("#label_info").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/Selected Node Tool : Now, Double click anywhere on the canvas to add node!/i)
            });
        })
    })

    // Test Case 03 - Connection Tool should be working fine...
    it('Checks whether the connection tool is working fine', () => {
        cy.get("button[title='Connection Tool']").click().then(() => {
            cy.get("#label_info").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/Selected Connection Tool : Now, click on any two nodes subsequently to add a connection!/i)
            });
        });
    })

    // Test Case 04 - Output Tool should be working fine...
    it('Checks whether the output tool is working fine', () => {
        cy.get("#alertModal").should("not.be.visible");

        // Checks for the alert and correct message...
        cy.get("button[title='Output Tool']").click().then(() => {
            cy.get("#alertModal").should("be.visible");
            cy.get("#alertModalBody").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/no nodes on the canvas/i);
            });
        });

        // Checks the closing functionality of the alert message...
        cy.get("#alertModal > div > div > div.modal-footer > button.btn.btn-secondary").click().then(() => {
            cy.get("#alertModal").should("not.be.visible");
        });
    })

    // Test Case 05 - Settings Tool should be working fine...
    it('Checks whether the settings tool is working fine', () => {
        cy.get("#settingsModal").should("not.be.visible");

        cy.get("button[title='Settings Tool']").click().then(() => {
            cy.get("#settingsModal").should("be.visible");
            cy.get("#key_enableKeyBindingForNodeTool").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/keyn/i);
            });
            cy.get("#key_enableKeyBindingForConnectionTool").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/keyc/i);
            });
            cy.get("#key_enableKeyBindingForSettings").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/keys/i);
            });
            cy.get("#key_enableKeyBindingForGenerateCode").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/keyg/i);
            });
            cy.get("#key_enableKeyBindingForUnselectTool").invoke("text").then((txt) => {
                expect(txt.trim()).to.match(/esc/i);
            });
        });

        cy.get("#settingsModal > div > div > div.modal-footer > button.btn.btn-secondary").click().then(() => {
            cy.get("#settingsModal").should("not.be.visible");
        });
    })

    // Test Case 06 - User manual button should be redirecting to github page...
    it('Checks whether the user manual is redirecting to correct page', () => {
        cy.get("button[title='User Manual']").click();
        cy.origin('https://github.com/', () => {
            cy.url().should("include", "/AristaLabRequestor");
        });
    })

    // Test Case 07 - Report an issue button should be redirecting to issue page...
    it('Checks whether the report an issue button is redirecting to correct page', () => {
        cy.get("button[title='Report an issue']").click();
        cy.origin('https://github.com/', () => {
            cy.url().should("include", "/AristaLabRequestor/issues");
        });
    })
})
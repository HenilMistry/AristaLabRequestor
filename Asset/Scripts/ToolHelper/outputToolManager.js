/**
 * This file responsible for managing the output
 * modal, where you'll see the output of the t-
 * opology that you have configured.
 */

/**
 * components of the output modal...
 */
const outputModal = new bootstrap.Modal('#outputModal');
const outputModalBody = document.getElementById("outputModalBody");
let finalOutput = undefined;

/**
 * Controlling functions...
 */

/**
 * This function will open the output modal and show
 * the output on the screen.
 * 
 * @param {string} output - The final output in string format.
 */
function openOutputModal(output) {
    finalOutput = output;
    outputModalBody.innerText = output;
    outputModal.show();
}

/**
 * This function will close the output modal.
 */
function closeOutputModal() {
    outputModalBody.innerText = "";
    outputModal.hide();
}

/**
 * This function will copy the output to the clip-
 * board.
 */
function copyOutput() {
    if (finalOutput != undefined) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(finalOutput)
              .then(() => {
                openAlertModal("Lab Requestor", "Output copied to clipboard!");
                // Just for debugging...
                // console.log("Text copied to clipboard successfully!");
              })
              .catch(err => {
                openAlertModal("Lab Requestor", "Failed to copy output!");
                // Just for debugging... 
                // console.error("Failed to copy text to clipboard:", err);
              });
        } else {
            openAlertModal("Lab Requestor", "Clipboard api not supported in this browser!");
            // Just for debugging... 
            // console.error("Clipboard API not supported in this browser.");
        }
    } else {
        openAlertModal("Lab Requestor", "Please click to generate output first!");
    }
}

function generateCode() {
    let output = "";
    if (settingsObj.topologyConfiguration.codeFormat == "Lab Request - SysTest") {
        output += "Probable location of the DUTS\n=============================\n";
        Nodes.forEach((node) => {
            if(node.NodeProperties instanceof Dut) {
                output += node.getNodePortableLocation()+"\n";
            }
        });
        output += "\n\n";

        output += "MOVE DUTS\n=============\n";
        Nodes.forEach((node) => {
            if(node.NodeProperties instanceof Dut) {
                output += node.getNodeMovement();
            }
        });
        output += "\n\n";

        output += "IXIA Ports Reserved\n==========================\n";
        Connections.forEach((connection) => {
            // Just for debugging...
            // console.log(connection);
            output += connection.connectionProperties.getIxiaPorts()+"\n";
        });
        output += "\n\n";

        output += "REMOVE CONNECTIONS\n=====================\n**** REMOVE ALL EXISTING CONNECTIONS on above mentioned DUTs and IXIA ports ****\n\n";

        output += "DUT-IXIA Connections:\n========================\n";
        output += ConnectionHelper.getDutToIxiaConnections();
        output += "\n\n";

        output += "DUT-DUT Connections:\n========================\n";
        output += ConnectionHelper.getDutToDutConnections();
        output += "\n\n";
    } else {
        let topology = {
            veos: {
                username: "cvpadmin",
                password: "cvp123!",
                version: "4.29.4M"
            },
            cvp: {
                username: "root",
                password: "cvproot",
                version: "2023.1.1",
                instance: "singlenode"
            },
            nodes: [
                {
                    cvp: {
                        ip_addr: "192.168.0.1",
                        node_type: "cvp",
                        auto_configuration: true
                    }
                },
            ],
            links: [
                
            ]

        };

        // all nodes section...
        node_ip_index = 2;
        all_used_ports = [];
        Nodes.forEach((node) => {
            let node_name = node.label;
            let node_info = {
                ip_addr: `192.168.0.${node_ip_index}`,
                node_type: "veos",
                ports: []
            };
            node_ip_index += 1;
            Connections.forEach((conn) => {
                if (node.label == conn.connectionProperties.nodeA.label) {
                    all_used_ports.push(...conn.connectionProperties.getUsedPortsList());
                } else if (node.label == conn.connectionProperties.nodeB.label) {
                    all_used_ports.push(...conn.connectionProperties.getUsedPortsList(false));
                }
            });
            all_used_ports.forEach((port) => {
                node_info.ports.push(port);
            });
            all_used_ports = [];
            let node_entry = {
                [node_name]: node_info
            }
            topology.nodes.push(node_entry);
        });

        // all links section...
        Connections.forEach((conn) => {
            conn.connectionProperties.ports.forEach((port) => {
                topology.links.push({
                    connection: [`${conn.connectionProperties.nodeA.label}:${port.identifierA}`, `${conn.connectionProperties.nodeB.label}:${port.identifierB}`]
                })
            });
        });
        output = jsyaml.dump(topology);
    }
    return output;
}
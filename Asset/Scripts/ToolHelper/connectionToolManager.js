const connectionsConfigurationModal = new bootstrap.Modal('#connectionsConfigurationModal');
const connectionsConfig_infoBox = document.getElementById('connectionsConfig_infoBox');
const connectionsConfig_LblIdentifierA = document.getElementById('connectionsConfig_LblIdentifierA');
const connectionsConfig_LblIdentifierB = document.getElementById('connectionsConfig_LblIdentifierB');
const connectionsConfig_portIdentifierA = document.getElementById('connectionsConfig_portIdentifierA');
const connectionsConfig_portIdentifierB = document.getElementById('connectionsConfig_portIdentifierB');
const connectionsConfig_bandWidth = document.getElementById('connectionsConfig_bandWidth');
const connectionsConfig_connections = document.getElementById('connectionsConfig_connections');
let connectionsConfig_warningTxt = document.getElementById('connectionsConfig_warningTxt'); // dyanmically change the visibility. So, using 'let' ...

let editID = undefined;

/**
 * Function to open the connections configuration modal.
 */
function openConnectionsConfigurationModal() {
    connectionsConfigurationModal.show();
    // Just for testing: Below two lines
    // console.log(firstNode);
    // console.log(secondNode);

    connectionsConfig_infoBox.innerText = "Configure connections between nodes : "+firstNode.NodeProperties.alias+" and "+secondNode.NodeProperties.alias+"";
    connectionsConfig_LblIdentifierA.innerText = "Port Identifier for : "+firstNode.NodeProperties.alias;
    connectionsConfig_LblIdentifierB.innerText = "Port Identifier for : "+secondNode.NodeProperties.alias;
}

function hideConnnectionsConfigurationModal() {
    connectionsConfigurationModal.hide();
    ports = [];
    if (click %2 == 0) {
        click = 0;
        firstNode = null;
        secondNode = null;
    }
}

function cleanUpConnectionsConfigModal() {
    connectionsConfig_portIdentifierA.value = "";
    connectionsConfig_portIdentifierB.value = "";
    connectionsConfig_bandWidth.value = "";
    connectionsConfig_warningTxt = document.getElementById('connectionsConfig_warningTxt');
    connectionsConfig_warningTxt.style.display = "block";
    if (ports.length > 0) {
        ports.forEach((port) => {
            const DivInHTML = document.getElementById(port.getID());
            DivInHTML.remove();
        });
    }
}

/**
 * Function to close the connections configuration modal.
 */
async function closeConnectionsConfigurationModal() {
    if(ports.length == 0) {
        // Case One : When connections are being edited from Node Manager modal
        if (selectedConnection != null) {
            let confirmation = await openConfirmationModal("Are you sure?", "All the ports are deleted. The connection will be removed. You want to proceed?");
            if (confirmation) {
                let idOfConnectionToBeDeleted = selectedConnection.getID();
                let index = -1;
                for (let i=0; i<Connections.length; i++) {
                    if (Connections[i].connectionProperties.getID() == idOfConnectionToBeDeleted) {
                        index = i;
                        break;
                    }
                }
                if (index != -1) {
                    Connections.splice(index, 1);
                }
                renderConnnections();
                hideConnnectionsConfigurationModal();
            } else {
                return;
            }
        }
        // Case Two : When connections are being added from the Connection Tool
        else if (selectedConnection == null) {
            let confirmation = await openConfirmationModal("Are you sure?","No ports are configured in this connection. Are you sure you want to proceed ?");
            if (!confirmation) {
                return;
            }
        }
    } else {
        // check if there are ports "left to save" in selected connection...

        /**
         * This if condition will only be executed when the Connection Configuration
         * modal is triggered using Node Configuration modal and user is closing the
         * connection configuration modal without configuring them.
         * 
         * This will act as a error prevention code. Mendatory to have this LOC.
         **/
        if (selectedConnection != null) {
            cleanUpConnectionsConfigModal();
            selectedConnection.ports = ports;
            selectedConnection = null;
            hideConnnectionsConfigurationModal();
        } else if (selectedConnection == null) {
            let confirmation = await openConfirmationModal("Are you sure?", "You have some unconfigured ports. You really don't want to configure the connection?")
            if (confirmation) {
                cleanUpConnectionsConfigModal();
                hideConnnectionsConfigurationModal();
            } else {
                return;
            }
        }
    }
}

/**
 * Function to configure the actual connection.
 */
function configureConnection() {
    // Below LOC will make sure that User configure at least one port ...
    if(ports.length == 0) {
        openAlertModal("Alert!","Please configure at least 1 Port in Connection!");
        return;
    }

    // Below LOC will make sure that existing GUI will be removed ...
    cleanUpConnectionsConfigModal();

    // Below LOC is Logical Part for connection ...
    if (selectedConnection == null) {
        let connection = new ConnectionHelper(firstNode, secondNode, c, ports);
        Connections.push(connection);
    } else {
        selectedConnection.ports = ports;
        selectedConnection = null;
    }

    hideConnnectionsConfigurationModal();
}

/**
 * This function will add render port information on the screen
 * when added while configuring the connection...
 * 
 * Default Code Snippet: 
 *  <div class="input-group mb-3">
 *    <span class="input-group-text">Something-port===Something-port</span>
 *    <button class="btn btn-outline-primary" type="button" id="connectionsConfig_edit">Edit</button>
 *    <button class="btn btn-outline-primary" type="button" id="connectionsConfig_delete">Delete</button>
 * </div>
 */
function addPortToConnection() {
    // Below code controls the flow of either updation or addition of port information on the screen ...
    if (editID != undefined && editID != null) {
        // if editId is not null and not undefined 
        // then execute below LOC ...
        editPortInConnection(editID);
        return;
    }

    // Below code controls the temp. storing of the ports for the current connection ...
    ports.push(new Port(connectionsConfig_portIdentifierA.value, connectionsConfig_portIdentifierB.value, connectionsConfig_bandWidth.value));

    // Below code controls the visibility of the warning text under Active Connections section ...
    if (ports.length == 0) { // There are no ports then show the warning! ...
        connectionsConfig_warningTxt.style.display = "block";
    } else { // There are some ports then don't show the warning! ...
        connectionsConfig_warningTxt.style.display = "none";
    }

    // Below code controls the rendering part for the newly added ports ...
    connectionsConfig_connections.innerHTML += "<div class='input-group mb-3' id='"+ports[ports.length-1].getID()+"'> <span class='input-group-text'>"+firstNode.NodeProperties.alias+"-"+connectionsConfig_portIdentifierA.value+" === "+connectionsConfig_bandWidth.value+" === "+connectionsConfig_portIdentifierB.value+"-"+secondNode.NodeProperties.alias+"</span> <button class='btn btn-outline-primary' type='button' onclick='updatePortInConnection(\""+ports[ports.length-1].getID()+"\")'> Edit </button> <button class='btn btn-outline-secondary' type='button' onclick='deletePortFromConnection(\""+ports[ports.length-1].getID()+"\")'> Delete </button> </div>";
}

/**
 * This function will render ports information on the screen
 * when opened from node manager modal...
 * 
 * @param {*} connection - The object of type connection
 */
function renderPortFromConnection(connection) {
    // Below LOC will make sure to update the information text for nodes...
    const nodeA = connection.nodeA.NodeProperties.alias;
    const nodeB = connection.nodeB.NodeProperties.alias;
    firstNode = connection.nodeA;
    secondNode = connection.nodeB;
    connectionsConfig_infoBox.innerText = "Configure connections between nodes : "+nodeA+" and "+nodeB+"";
    connectionsConfig_LblIdentifierA.innerText = "Port Identifier for : "+nodeA;
    connectionsConfig_LblIdentifierB.innerText = "Port Identifier for : "+nodeB;
    connectionsConfig_warningTxt = document.getElementById('connectionsConfig_warningTxt');
    connectionsConfig_warningTxt.style.display = "none";

    // Below LOC will make sure to render the existing ports...
    connection.ports.forEach((port) => {
        ports.push(port);
        const id = port.getID();
        connectionsConfig_connections.innerHTML += "<div class='input-group mb-3' id='"+id+"'> <span class='input-group-text'>"+nodeA+"-"+port.identifierA+" === "+port.speed+" === "+port.identifierB+"-"+nodeB+"</span> <button class='btn btn-outline-primary' type='button' onclick='updatePortInConnection(\""+id+"\")'> Edit </button> <button class='btn btn-outline-secondary' type='button' onclick='deletePortFromConnection(\""+id+"\")'> Delete </button> </div>";
    });
    connection.ports = null;

    // Below LOC will make sure that it will open the dialog box...
    connectionsConfigurationModal.show();
}

/**
 * Function to edit the port in connection
 * 
 * @param {*} EditID - Unique Div identification
 * @returns 
 */
async function editPortInConnection(EditID) {
    // Below code controls the flow of either updating or not updating the connection as per thr use choice ...
    const result = await openConfirmationModal("Are you sure?","Do you really want to edit this connection?");
    if (!result) {
        return;
    }

    // Below code controls the updation of port in temp. storage from the current connection ...
    ports.forEach((port)=>{
        if (port.getID() == EditID) {
            port.identifierA = connectionsConfig_portIdentifierA.value;
            port.identifierB = connectionsConfig_portIdentifierB.value;
            port.speed = connectionsConfig_bandWidth.value;
        }
    });

    // Below code controls the rendering part for the updated port ...
    let connectionsConfig_connection = document.getElementById(EditID);
    connectionsConfig_connection.innerHTML="<span class='input-group-text'>"+firstNode.NodeProperties.alias+"-"+connectionsConfig_portIdentifierA.value+" === "+connectionsConfig_bandWidth.value+" === "+connectionsConfig_portIdentifierB.value+"-"+secondNode.NodeProperties.alias+"</span> <button class='btn btn-outline-primary' type='button' onclick='updatePortInConnection(\""+editID+"\")'> Edit </button> <button class='btn btn-outline-secondary' type='button' onclick='deletePortFromConnection(\""+editID+"\")'> Delete </button>";
    editID = undefined;
}

/**
 * Function to update the port in connection.
 * 
 * @param {*} DivID Div identification
 */
function updatePortInConnection(DivID) {
    // Below code controls the acknowledgement to the user to let them know ...
    openAlertModal("Info!","Now you can edit the port and click on 'Add Port' to confirm!!");
    editID = DivID;

    // Below code controls the updation of fields in the port configuration ...
    let portToEdit = null;
    ports.forEach((port)=>{
        if (port.getID()==DivID) {
            portToEdit = port;
        }
    });
    connectionsConfig_portIdentifierA.value = portToEdit.identifierA;
    connectionsConfig_portIdentifierB.value = portToEdit.identifierB;
    connectionsConfig_bandWidth.value = portToEdit.speed;
}

/**
 * This function will remove port information from the screen ...
 * 
 * @param {*} DivID - The id from the object 'Port' for Div identification
 */
async function deletePortFromConnection(DivID) {
    // Below code controls the flow of either deleting or not deleting the connection as per the user choice ...
    const result = await openConfirmationModal("Are you sure?","Do you really want to delete this connection?");
    if (!result) {
        return;
    }

    // Below code controls the deletion of ports from temp. storage from the current connection ...
    let index;
    for(let i = 0; i < ports.length; i++) {
        if (ports[i].getID()==DivID) {
            index = i;
            break;
        }
    }
    ports.splice(index,1);

    // Below code controls the visiblily of the warning text under the Active Connections section ...
    if(ports.length==0) {
        connectionsConfig_warningTxt = document.getElementById('connectionsConfig_warningTxt');
        connectionsConfig_warningTxt.style.display = "block";
    }

    // Below code controls the rendering part for the deleted port ...
    const DivInHTML = document.getElementById(DivID);
    DivInHTML.remove();
}
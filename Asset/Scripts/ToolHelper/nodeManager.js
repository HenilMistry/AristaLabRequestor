/**
 * This file is responsible to manager the node 
 * management modal.
 */

const nodeManagerModal = new bootstrap.Modal('#nodeManagerModal');
const nodeManagerModal_LblNodeIdentifier = document.getElementById("nodeManagerModal_LblNodeIdentifier");
const nodeManagerModal_connections = document.getElementById("nodeManagerModal_connections");
const nodeManagerModal_nodeInfo = document.getElementById("nodeManagerModal_nodeInfo");
let nodeManager_warningTxt = document.getElementById("nodeManager_warningTxt");

function updateNodeInfoInNodeManager() {
    let activeConnections = [];
    Connections.forEach((conn) => {
        if (conn.connectionProperties.nodeA == selectedNode || conn.connectionProperties.nodeB == selectedNode) {
            activeConnections.push(conn);
        }
    });

     // Below LOC will render warning msg, if no connections are there...
     if (activeConnections.length != 0) {
        nodeManager_warningTxt = document.getElementById("nodeManager_warningTxt");
        nodeManager_warningTxt.style.display = "none";
    } else {
        nodeManager_warningTxt = document.getElementById("nodeManager_warningTxt");
        nodeManager_warningTxt.style.display = "block";
    }

    nodeManagerModal_nodeInfo.innerHTML = "Type : "+((selectedNode.NodeProperties instanceof Dut)?("NODE-DUT"):("NODE-IXIA"))+" <br> Movement : "+((selectedNode.getNodeMovement()=="")?("N/A"):(selectedNode.getNodeMovement()))+" <br> Active Connections : "+activeConnections.length;
}

function openNodeManagerModal() {
    // Below LOC will check for the active connections of the selected node...
    nodeManagerModal_LblNodeIdentifier.innerText = "Node Management for : "+selectedNode.NodeProperties.alias;
    let activeConnections = [];
    Connections.forEach((conn) => {
        // either of the end is selected node...
        if (conn.connectionProperties.nodeA == selectedNode || conn.connectionProperties.nodeB == selectedNode) {
            // add that connection to node manager...
            activeConnections.push(conn);
        }
    });

    // Below LOC will render the connections to HTML...
    updateNodeInfoInNodeManager();
    let nodeManagerModal_finalConnections = "";
    activeConnections.forEach((activeConn) => {
        let id = activeConn.connectionProperties.getID();
        // Sample output that will be added per connection...
        // <div class="input-group mb-3" id="">
        //     <span class="input-group-text">DUT-XYZ===========DUT-ABC</span>
        //     <button class="btn btn-outline-primary" type="button" id="">Edit</button>
        //     <button class="btn btn-outline-danger" type="button" id="">Delete</button>
        // </div>
        nodeManagerModal_finalConnections += '<div class="input-group mb-3" id="'+id+'"> <span class="input-group-text">'+activeConn.connectionProperties.toString()+'</span> <button class="btn btn-outline-primary" type="button" id="'+id+'" onclick="editConnection(\''+id+'\')">Edit</button> <button class="btn btn-outline-danger" type="button" id="'+id+'" onclick="deleteConnection(\''+id+'\')">Delete</button>  </div>';
    });
    nodeManagerModal_connections.innerHTML = nodeManagerModal_finalConnections;

    // Below LOC will show the node manager modal...
    nodeManagerModal.show();
}

function closeNodeManagerModal() {
    nodeManagerModal.hide();
    selectTool(Tools.NODE);
    selectedNode.select(false);
    selectedNode = null;
}

async function deleteNode() {
    // Below LOC will make sure to confirm with user...
    let result = await openConfirmationModal("Are you sure?","All the connections with this node will be removed!!");
    if (result) {
        // mark the id of selected node...
        let mainID = selectedNode.NodeProperties.getID();
        
        // Find All of the connections of selected node...
        let ids = [];
        Connections.forEach((conn, index) => {
            if (conn.connectionProperties.nodeA.NodeProperties.getID() == mainID || conn.connectionProperties.nodeB.NodeProperties.getID() == mainID) {
                console.log("Adding the connection to be deleted : "+conn.connectionProperties.toString());
                ids.push(index);
            }
        });

        // Remove all of the connections...
        for(let i=0; i<ids.length; i++) {
            console.log("Deleting the connection : "+Connections[ids[i]-i].connectionProperties.toString());
            Connections.splice(ids[i]-i,1);
        }
        
        // Remove the selected node...
        for(let i=0; i<Nodes.length; i++) {
            if(Nodes[i].NodeProperties.getID() == mainID) {
                ids.push(i);
                break;
            }
        }
        Nodes.splice(ids[ids.length-1],1);
        closeNodeManagerModal();
    }
}

function editConnection(connectionID) {
    Connections.forEach((conn) => {
        if(conn.connectionProperties.getID() == connectionID) {
            selectedConnection = conn.connectionProperties;
            renderPortFromConnection(conn.connectionProperties);
        }
    });
}

async function deleteConnection(connectionID) {
    // Find the connection...
    let index = -1;
    for(let i=0; i<Connections.length; i++) {
        if (Connections[i].connectionProperties.getID() == connectionID) {
            let result = await openConfirmationModal("Are you sure?", "The connection will be removed and all the ports too!");
            if (result) {
                index = i;
            }
            break;
        }
    }

    // Delete the connection...
    if (index != -1) {
        Connections.splice(index,1);
        const DivInHTML = document.getElementById(connectionID);
        DivInHTML.remove();
        updateNodeInfoInNodeManager();
    }
}
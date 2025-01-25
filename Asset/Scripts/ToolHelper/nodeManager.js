/**
 * This file is responsible to manager the node 
 * management modal.
 */

const nodeManagerModal = new bootstrap.Modal('#nodeManagerModal');
const nodeManagerModal_LblNodeIdentifier = document.getElementById("nodeManagerModal_LblNodeIdentifier");
const nodeManagerModal_connections = document.getElementById("nodeManagerModal_connections");
const nodeManagerModal_nodeInfo = document.getElementById("nodeManagerModal_nodeInfo");

function openNodeManagerModal() {
    // Below LOC will check for the active connections of the selected node...
    let activeConnections = [];
    Connections.forEach((conn) => {
        // either of the end is selected node...
        if (conn.connectionProperties.nodeA == selectedNode || conn.connectionProperties.nodeB == selectedNode) {
            // add that connection to node manager...
            activeConnections.push(conn);
        }
    });

    // Below LOC will render the connections to HTML...
    nodeManagerModal_nodeInfo.innerHTML = "Type : "+((selectedNode.NodeProperties instanceof Dut)?("NODE-DUT"):("NODE-IXIA"))+" <br> Movement : "+((selectedNode.getNodeMovement()=="")?("N/A"):(selectedNode.getNodeMovement()))+" <br> Active Connections : "+activeConnections.length;
    let nodeManagerModal_finalConnections = "";
    activeConnections.forEach((activeConn) => {
        // Sample output that will be added per connection...
        // <div class="input-group mb-3">
        //     <span class="input-group-text">DUT-XYZ===========DUT-ABC</span>
        //     <button class="btn btn-outline-primary" type="button" id="">Edit</button>
        //     <button class="btn btn-outline-danger" type="button" id="">Delete</button>
        // </div>
        nodeManagerModal_finalConnections += '<div class="input-group mb-3"> <span class="input-group-text">'+activeConn.connectionProperties.toString()+'</span> <button class="btn btn-outline-primary" type="button" id="'+activeConn.connectionProperties.getID()+'">Edit</button> <button class="btn btn-outline-danger" type="button" id="'+activeConn.connectionProperties.getID()+'">Delete</button>  </div>';
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
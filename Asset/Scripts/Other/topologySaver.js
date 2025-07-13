/**
 * This file will be responsible to manage the save topology
 * modal. Will be able to do all the necessary stuff regarding
 * topology management.
 */

const saveTopologyModal = new bootstrap.Modal("#saveTopologyModal");
const saveTopologyModalLabel = document.getElementById("saveTopologyModalLabel");
const saveTopologyModal_closeIcon = document.getElementById("saveTopologyModal_closeIcon");
const saveTopologyModal_inputTopologyName = document.getElementById("saveTopologyModal_inputTopologyName");
const saveTopologyModal_saveTopologyBtn = document.getElementById("saveTopologyModal_saveTopologyBtn");
const saveTopologyModal_saveAndDownloadBtn = document.getElementById("saveTopologyModal_saveAndDownloadBtn");
const saveTopologyModal_closeButton = document.getElementById("saveTopologyModal_closeButton");
const select_savedTopologies = document.getElementById("select_savedTopologies");

let savedTopologies = {};

function openSaveTopologyModal() {
    saveTopologyModal.show();
}

function closeSaveTopologyModal() {
    saveTopologyModal.hide();
}

function loadSavedTopologies() {
    const local_savedTopologies = localStorage.getItem("AristaLabRequestorSavedTopologies");
    if (local_savedTopologies) {
        let temp_savedToplogies = JSON.parse(local_savedTopologies);
        savedTopologies = temp_savedToplogies;
        select_savedTopologies.innerHTML = "";
        if (Object.keys(savedTopologies).length == 0) {
            select_savedTopologies.innerHTML += `<option selected>No Topology Selected</option>`;
        } else {
            Object.entries(temp_savedToplogies).forEach(([key, value])=> {
                select_savedTopologies.innerHTML += `<option>${key}</option>`;
            });
        }
    }
}

function saveTopologies() {
    localStorage.setItem("AristaLabRequestorSavedTopologies", JSON.stringify(savedTopologies));
}

function downloadTopology(filename, topology) {
    const dataStr = JSON.stringify(topology, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function checkIfTopologyExists(topology_name) {
    // check if the topology exists in backend...
    let valid_topology = false;
    Object.entries(savedTopologies).forEach(([key, value])=> {
        if (topology_name == key) {
            valid_topology = true;
            return;
        }
    });

    // throw a message and exit if it's an invalid topology name...
    if (valid_topology==false || topology_name=="" || topology_name.trim() == "") {
        openAlertModal("Alert!", `No such topology : '${topology_name}' is found!`);
        return false;
    }
    return true;
}

function saveTopology(download = false) {
    // check if the topology name is not given...
    if (saveTopologyModal_inputTopologyName.value == "" || saveTopologyModal_inputTopologyName.value.trim() == "") {
        openAlertModal("Alert!", "Please give a name to topology!");
        return;
    }
    
    // save the topology...
    // make the topology...
    let topology = {
        version: 'v1.0',
        appVersion: 'v4.0',
        connections: []        
    }
    Connections.forEach((conn) => {
        topology.connections.push(conn.getJSON());
    });
    if (Object.keys(savedTopologies).length == 0) {
       select_savedTopologies.innerHTML = ""; 
    }
    select_savedTopologies.innerHTML += `<option>${saveTopologyModal_inputTopologyName.value}</option>`;

    // save to the local storage...
    savedTopologies[`${saveTopologyModal_inputTopologyName.value}`] = topology;
    saveTopologies();

    // download the topology, if asked
    if (download == true) {
        downloadTopology(saveTopologyModal_inputTopologyName.value, topology);
    } else {
        openAlertModal("Success!", "Topology has been saved successfully! Check settings for more!");
    }
}

saveTopologyModal_closeButton.addEventListener("click", () => {
    closeSaveTopologyModal();
})

saveTopologyModal_closeIcon.addEventListener("click", () => {
    closeSaveTopologyModal();
})

saveTopologyModal_saveTopologyBtn.addEventListener("click", saveTopology);

saveTopologyModal_saveAndDownloadBtn.addEventListener("click", () => {
    saveTopology(true);
})

document.getElementById("deleteTopology").addEventListener("click", async () => {
    // get the name of the topology
    let topology_name = select_savedTopologies.value;

    // check if the topology exists in backend...
    if (checkIfTopologyExists(topology_name) == false) {
        return;
    }

    // if it's a valid topology, delete it after confirmation...
    let confirmation = await openConfirmationModal("Are you sure?", "You really want to delete this topology ?");
    if (confirmation == true) {
        delete savedTopologies[topology_name];
        // store the updated value to the backend...
        saveTopologies();

        // reflect the changes into front-end...
        loadSavedTopologies();
    } else {
        return;
    }
});

document.getElementById("downloadTopology").addEventListener("click", () => {
    // get the name of the topology
    let topology_name = select_savedTopologies.value;

    // check if the topology exists in backend...
    if (checkIfTopologyExists(topology_name) == false) {
        return;
    }

    // if it's a valid topology, download it...
    downloadTopology(topology_name, savedTopologies[topology_name]);
});

document.getElementById("loadTopology").addEventListener("click", () => {
    // get the name of the topology
    let topology_name = select_savedTopologies.value;

    // check if the topology exists in backend...
    if (checkIfTopologyExists(topology_name) == false) {
        return;
    }

    // load the topology...

    // before load, empty all the connections and nodes...
    Connections = [];
    Nodes = [];

    // get the topology configuration JSON...
    let topology = savedTopologies[topology_name];
    let temp_node_ids = {};

    // loop through connections...
    topology.connections.forEach((conn) => {
        let nodeA = conn.connectionProperties.nodeA;
        let nodeB = conn.connectionProperties.nodeB;
        let ports = conn.connectionProperties.ports;

        let properties_nodeA = nodeA.nodeProperties;
        let properties_nodeB = nodeB.nodeProperties;

        let new_node_prop_a, new_node_prop_b;
        let nodeA_exist = false, nodeB_exist = false;

        if (temp_node_ids[properties_nodeA.id] == null) {
            if (properties_nodeA.movement == null) {
                new_node_prop_a = new Ixia(properties_nodeA.alias, properties_nodeA.location);
            } else {
                new_node_prop_a = new Dut(properties_nodeA.alias, properties_nodeA.location, properties_nodeA.movement);
            }
            temp_node_ids[properties_nodeA.id] = new Node(nodeA.label, nodeA.x, nodeA.y, nodeA.radius, nodeA.color, c);
            temp_node_ids[properties_nodeA.id].NodeProperties = new_node_prop_a;
        } else {
            new_node_prop_a = temp_node_ids[properties_nodeA.id];
            nodeA_exist = true;
        }

        if (temp_node_ids[properties_nodeB.id] == null) {
            if (properties_nodeB.movement == null) {
                new_node_prop_b = new Ixia(properties_nodeB.alias, properties_nodeB.location);
            } else {
                new_node_prop_b = new Dut(properties_nodeB .alias, properties_nodeB.location, properties_nodeB.movement);
            }
            temp_node_ids[properties_nodeB.id] = new Node(nodeB.label, nodeB.x, nodeB.y, nodeB.radius, nodeB.color, c);
            temp_node_ids[properties_nodeB.id].NodeProperties = new_node_prop_b;
        } else {
            new_node_prop_b = temp_node_ids[properties_nodeB.id];
            nodeB_exist = true;
        }

        if (nodeA_exist == false) {
            Nodes.push(temp_node_ids[properties_nodeA.id]);
        }

        if (nodeB_exist == false) {
            Nodes.push(temp_node_ids[properties_nodeB.id]);
        }

        let new_ports = [];
        ports.forEach((port) => {
            new_ports.push(new Port(port.identifierA, port.identifierB, port.speed));
        }); 

        let new_connection = new ConnectionHelper(temp_node_ids[properties_nodeA.id], temp_node_ids[properties_nodeB.id], c, new_ports);
        Connections.push(new_connection);
        
    });
});
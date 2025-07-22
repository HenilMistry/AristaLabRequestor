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

const uploadTopologyModal = new bootstrap.Modal("#uploadTopologyModal");
const uploadTopologyModal_closeIcon = document.getElementById("uploadTopologyModal_closeIcon");
const uploadTopologyModal_inputType = document.getElementById("uploadTopologyModal_inputType");
const uploadTopologyModal_uploadTopology = document.getElementById("uploadTopologyModal_uploadTopology");
const uploadTopologyModal_closeButton = document.getElementById("uploadTopologyModal_closeButton");
const fileInputForTopology = document.getElementById("fileInputForTopology");

let savedTopologies = {};
let uploadType = "json";

function openSaveTopologyModal() {
    saveTopologyModal.show();
}

function openUploadTopologyModal() {
    uploadTopologyModal.show();
}

function closeSaveTopologyModal() {
    saveTopologyModal.hide();
}

function closeUploadTopologyModal() {
    uploadTopologyModal.hide();
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

function loadSavedJSON(topology_name) {
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
}

function loadSavedYML(topology_name) {
    let topology = savedTopologies[topology_name];

    let node_signature = {};
    let port_signature = {};
    let signature = {};

    topology.nodes.forEach((node) => {
        let nodeProp = new Dut(Object.keys(node)[0], "Lab", Dut.NO_MOVETO);
        let nodeGui = new Node(
            nodeProp.alias, 
            Math.ceil(Math.random()*(window.innerWidth)),
            Math.ceil(Math.random()*(window.innerHeight)),
            20,
            "Red",
            c
        );
        nodeGui.NodeProperties = nodeProp;
        Nodes.push(nodeGui);
        if (!topology.hasOwnProperty("links")) {
            node_signature[nodeProp.alias] = Nodes.length-1;
        }
    });

    if (topology.hasOwnProperty("links")) {
        // updated version of YAML format is used...
        topology.links.forEach((link) => {
            let firstTempNode, secondTempNode;
            let first = link.connection[0].split(/:/);
            let second = link.connection[1].split(/:/);
            let this_sig = `${first[0]}-${second[0]}`;

            Nodes.forEach((node) => {
                if (node.label == first[0]) {
                    firstTempNode = node;
                } else if (node.label == second[0]) {
                    secondTempNode = node;
                }
            })

            let port = new Port(first[1], second[1], "1G");

            if (signature.hasOwnProperty(this_sig)) {
                // connection already exist...
                Connections[signature[this_sig]].connectionProperties.ports.push(port);
            } else {
                // create a connection...
                let connectionTemp = new ConnectionHelper(firstTempNode, secondTempNode, c, [port]);
                Connections.push(connectionTemp);
                signature[this_sig] = Connections.length-1;
            }
        });
    } else {
        // Using depricated field "neighbors" under nodes...
        // Loop through the nodes again...
        topology.nodes.forEach((node) => {
            if (node[Object.keys(node)[0]].hasOwnProperty("neighbors")) {
                let firstTempNode, secondTempNode;
                firstTempNode = Object.keys(node)[0];
                
                node[Object.keys(node)[0]].neighbors.forEach((neighbor) => {
                    secondTempNode = neighbor.neighborDevice;
                    let this_sig = `${firstTempNode}-${secondTempNode}`;

                    let port = new Port(neighbor.port, neighbor.neighborPort, "1G");
                    let port_sig = `${firstTempNode}:${neighbor.port}-${secondTempNode}:${neighbor.neighborPort}`;

                    if (!(port_signature.hasOwnProperty(port_sig) || port_signature.hasOwnProperty(`${secondTempNode}:${neighbor.neighborPort}-${firstTempNode}:${neighbor.port}`))) {
                        if (signature.hasOwnProperty(this_sig)) {
                            Connections[signature[this_sig]].connectionProperties.ports.push(port);
                        } else {
                            let connectionTemp = new ConnectionHelper(Nodes[node_signature[firstTempNode]],  Nodes[node_signature[secondTempNode]], c, [port]);
                            Connections.push(connectionTemp);
                            signature[this_sig] = Connections.length-1;
                        }
                        port_signature[port_sig] = port;
                        console.log(port_sig);
                    }
                });
            }
        });
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

uploadTopologyModal_closeButton.addEventListener("click", () => {
    closeUploadTopologyModal();
})

uploadTopologyModal_closeIcon.addEventListener("click", () => {
    closeUploadTopologyModal();
})

uploadTopologyModal_inputType.addEventListener("change", function () {
    const index = this.selectedIndex;
    const text = this.options[index].text;
    switch(text) {
        case "App Configured JSON": {
            fileInputForTopology.accept = '.json';
            uploadType = "json";
        }
        break;

        case "Existing YAML": {
            fileInputForTopology.accept = '.yml .yaml';
            uploadType = "yml";
        }
        break;

        case "Existing SysTest-LabRequest": {
            fileInputForTopology.accept = '.text';
            uploadType = "text";
        }
        break;

        default: {
            openAlertModal("Error!", `No such upload option : "${text}" available!`);
        }
        break;
    }
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

    if (savedTopologies[topology_name].hasOwnProperty("links") || savedTopologies[topology_name].hasOwnProperty("nodes")) {
        loadSavedYML(topology_name);
    } else if (savedTopologies[topology_name].hasOwnProperty("version")) {
        loadSavedJSON(topology_name);
    } else {
        openAlertModal("Error!", "Unknown error occurred while loading topology!");
    }

    openAlertModal("Success", "Topology has been loaded!");
});

document.getElementById("uploadTopology").addEventListener("click", () => {
    openUploadTopologyModal();
});

fileInputForTopology.addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        let topology, error = false;
        switch(uploadType) {
            case "json": {
                topology = JSON.parse(e.target.result);
            } break;

            case "yml": {
                topology = jsyaml.load(e.target.result);
                console.log(topology);
            } break;

            case "text": {
                // TODO: Implement this
            } break;

            default: {
                openAlertModal("Error!", "Unknown file type found while parsing!")
            } break;
        }
        if (error == false) {
            savedTopologies[file.name] = topology;
            saveTopologies();
            loadSavedTopologies();
            openAlertModal("Success!", "File has been uploaded!");
        }
    };

    reader.readAsText(file);
});

uploadTopologyModal_uploadTopology.addEventListener("click", () => {
    fileInputForTopology.click();
});
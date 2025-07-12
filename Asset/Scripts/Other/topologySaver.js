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
        Object.entries(temp_savedToplogies).forEach(([key, value])=> {
            select_savedTopologies.innerHTML += `<option>${key}</option>`;
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
    select_savedTopologies.innerHTML += `<option>${saveTopologyModal_inputTopologyName.value}</option>`;

    // save to the local storage...
    savedTopologies[`${saveTopologyModal_inputTopologyName.value}`] = topology;
    saveTopologies();

    // download the topology, if asked
    if (download == true) {
        downloadTopology(saveTopologyModal_inputTopologyName.value, topology);
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
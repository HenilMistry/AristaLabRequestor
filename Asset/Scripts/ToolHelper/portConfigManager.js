const portConfigModal = new bootstrap.Modal('#portConfigModal');
const portDeleteConfirmationModal = new bootstrap.Modal("#portDeleteConfirmationModal");
const select_nodePorts = document.getElementById("nodePorts");
const field_portIdentifier = document.getElementById("portIdentifier");
const field_portSpeed = document.getElementById("portSpeed");
const lbl_portConfig = document.getElementById("portConfigModalLbl");
let editingPort = false;
let editId = -1;

function addPort() {
    if (!editingPort) {
        let newPort = new Port(PORT_ID,field_portIdentifier.value, field_portSpeed.value);
        PORT_ID++;
        ports.push(newPort);
        alert("Port Added! You can continue adding new ports or close!");
    } else {
        let editObj = ports.filter(port => port.id == select_nodePorts.value);
        editObj[0].identifier = field_portIdentifier.value;
        editObj[0].speed = field_portSpeed.value;
        alert("Port Has Been Edited!");
        closeEditPortConfig();
    }
    field_portIdentifier.value = "";
    field_portSpeed.value = "";
}

function editPort() {
    
}

function deletePort() {
    for(let i=0; i<ports.length; i++) {
        if(ports[i].id == select_nodePorts.value) {
            ports.splice(i,1);
            break;
        }
    }
    closePortDeleteConfirmationModal();
    closePortConfig();
}

function openPortDeleteConfirmationModal() {
    if (select_nodePorts.options.length > 0) {
        portDeleteConfirmationModal.show();
    } else {
        alert("No Ports Configured!!");
    }
}

function closePortDeleteConfirmationModal() {
    portDeleteConfirmationModal.hide();
}

function openPortConfig() {
    portConfigModal.show();
    lbl_portConfig.innerHTML = "Port Configuration";
}

function closePortConfig() {
    portConfigModal.hide();
    select_nodePorts.innerHTML = "";
    ports.forEach((obj) => {
        var option = document.createElement('option');
        option.value = obj.id;
        option.innerHTML = obj.toString();
        select_nodePorts.appendChild(option);
    });
}

function openEditPortConfig() {
    if (select_nodePorts.options.length > 0) {
        let editObj = ports.filter(port => port.id == select_nodePorts.value);
        openPortConfig();
        lbl_portConfig.innerHTML = "Edit Port Configuration";
        field_portIdentifier.value = editObj[0].identifier;
        field_portSpeed.value = editObj[0].speed;
        editingPort = true;
        editId = select_nodePorts.value;
    } else {
        alert("No ports are configured to edit!!");
    }
}

function closeEditPortConfig() {
    closePortConfig();
}
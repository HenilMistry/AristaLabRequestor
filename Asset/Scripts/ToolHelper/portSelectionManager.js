const portSelectionModal = new bootstrap.Modal('#portSelectionModal');
const select_portList = document.getElementById('portList');
const field_Identifier = document.getElementById('portIdentifierDut');
const field_Speed = document.getElementById('portSpeedDut');

const field_for_dut = document.getElementById("portSelectionDut");
const field_for_dut_speed = document.getElementById("portSpeedSelectionDut");
const field_for_ixia = document.getElementById("portSelectionIxia");

function openPortSelectionModal() {
    portSelectionModal.show();
    console.log(firstNode);
        console.log(secondNode);
    if (isIxiaNode) {
        field_for_dut.style.display = "none";
        field_for_dut_speed.style.display = "none";
        field_for_ixia.style.display = "block";

        let destinationPorts;
        if(click %2 == 0) {
            destinationPorts = secondNode.NodeProperties.ports;
        } else {
            destinationPorts = firstNode.NodeProperties.ports;
        }
        console.log(destinationPorts);

        select_portList.innerHTML = "";
        destinationPorts.forEach((port) => {
            console.log(port);
            console.log(port.toString());
            var option = document.createElement('option');
            option.value = port.id;
            option.innerHTML = port.toString();
            select_portList.appendChild(option);
        });
    } else {
        field_for_dut.style.display = "block";
        field_for_dut_speed.style.display = "block";
        field_for_ixia.style.display = "none";
    }
}

function closePortSelectionModal() {
    portSelectionModal.hide();
    isIxiaNode = false;
    if (click %2 == 0) {
        let newConnection = new ConnectionHelper(firstNode, secondNode, c);
        newConnection.DutPorts = dutPort;
        newConnection.IxiaPort = ixiaPort;

        Connections.push(newConnection);
        click = 0;
        firstNode = null;
        secondNode = null;
        isIxiaNode = false;
        ixiaPort = null;
        dutPort = [];
        ports = [];
    }
    console.log(Connections);
}

function configurePortSelection() {
    if(isIxiaNode) {
        let selectedPort;
        if(click %2 == 0) {
            selectedPort = secondNode.NodeProperties.ports.filter(port => port.id == select_portList.value);
        } else {
            selectedPort = firstNode.NodeProperties.ports.filter(port => port.id == select_portList.value);
        }
        ixiaPort = selectedPort[0];
    } else {
        let newPort = new Port(PORT_ID,field_Identifier.value, field_Speed.value);
        PORT_ID++;
        ports.push(newPort);
        dutPort.push(newPort);
    }
    closePortSelectionModal();
}
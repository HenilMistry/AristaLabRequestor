const nodeConfigModal = new bootstrap.Modal('#nodeConfigModal');
const select_nodeType = document.getElementById("nodeType");

const field_nodeAlias = document.getElementById("nodeAlias");
const field_location = document.getElementById("nodeLocation");
const chk_enableMoveTo = document.getElementById("enableMoveTo");
const field_moveTo = document.getElementById("moveTo");
// select_nodePorts is defined in portConfigManager.js ...

chk_enableMoveTo.addEventListener("click",(e) => {
    field_moveTo.disabled = !chk_enableMoveTo.checked;
});

let lastX=0, lastY=0;

function openNodeConfig() {
    nodeConfigModal.show();
}

function closeNodeConfig() {
    nodeConfigModal.hide();
    NodeToolActivated = 1;
    ActiveTool = Tools.NODE;
}

function configureNode() {
    let newAlias = field_nodeAlias.value;
    let newLocation = field_location.value;
    let newIxiaNode, newDutNode, newNode;
    let isTypeIxia = false;

    // Check if type is ixia and no ports are configured ?...
    if(select_nodeType.value == "ixia") {
        newIxiaNode = new Ixia(newAlias, newLocation);
        NodeIxia.push(newIxiaNode);
        isTypeIxia = true;
    } else { // collect the data and store DUT Node...
        if(chk_enableMoveTo.checked) {
            newDutNode = new Dut(newAlias, newLocation, field_moveTo.value);
        } else {
            newDutNode = new Dut(newAlias, newLocation, Dut.NO_MOVETO);
        }
        NodeDut.push(newDutNode);
    }

    newNode = new Node(newAlias, lastX, lastY, 20, "Red", c);
    if (isTypeIxia) {
        newNode.NodeProperties = newIxiaNode;
    } else {
        newNode.NodeProperties = newDutNode;
    }
    Nodes.push(newNode);
    closeNodeConfig();
}

select_nodeType.addEventListener("change",(e) => {
    const collectionIxia = document.getElementsByClassName("ixia");
    const collectionDut = document.getElementsByClassName("dut");
    if (select_nodeType.value == "dut") {
        for (let elem of collectionIxia) {
            elem.style.display = "none";
        }
        for (let elem of collectionDut) {
            elem.style.display = "block";
        }
    } else {
        for (let elem of collectionDut) {
            elem.style.display = "none";
        }
        for (let elem of collectionIxia) {
            elem.style.display = "block";
        }
    }
});
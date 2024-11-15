const nodeConfigModal = new bootstrap.Modal('#nodeConfigModal');

function openNodeConfig() {
    nodeConfigModal.show();
}

function closeNodeConfig() {
    nodeConfigModal.hide();
    NodeToolActivated = 1;
    ActiveTool = Tools.NODE;
}

const select_nodeType = document.getElementById("nodeType");

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
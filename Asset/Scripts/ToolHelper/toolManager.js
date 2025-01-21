// Enum Type, That contins the list of all avilable tools
const Tools = Object.freeze({
    NODE : "Node",
    CONNECTION : "Connection"
});

// A variable to keep track of active, slected tool 
var ActiveTool = null;

// A variable, that is HTML Element, that is contianing information text 
const label_info = document.getElementById("label_info");

// A function to select the toolbar, which will update the ActiveTool avariable
function selectTool(name) {
    switch(name) {
        case Tools.NODE:
            ActiveTool=Tools.NODE;
            NodeToolActivated = 1;
            label_info.innerHTML = '<img src="./Asset/Icons/info.png" alt="Information" width="30px"> Selected Node Tool : Now, click anywhere on canvas to add node!';
            break;
        
        case Tools.CONNECTION:
            ActiveTool=Tools.CONNECTION;
            label_info.innerHTML = '<img src="./Asset/Icons/info.png" alt="Information" width="30px"> Selected Connection Tool : Now, click on any two nodes subsequently to add a connection!';
            break;
        
        default:
            ActiveTool = null;
            label_info.innerHTML = '<img src="./Asset/Icons/info.png" alt="Information" width="30px"> Select some tool to start making Topology!';
            break;
    }
}
// Enum Type, That contins the list of all avilable tools
const Tools = Object.freeze({
    NODE : "Node",
    CONNECTION : "Connection",
    NODE_SELECTION_STATE : "NodeSelectedState"
});

// A variable to keep track of active, slected tool 
var ActiveTool = null;

// A variable, that is HTML Element, that is contianing information text 
const label_info = document.getElementById("label_info");

// This is image of information icon, you can use this for prepadding your information label...
const infoImagePath = '<img src="./Asset/Icons/info.png" alt="Information" width="30px"> ';

// A function to select the toolbar, which will update the ActiveTool avariable
function selectTool(name) {
    switch(name) {
        case Tools.NODE:
            firstNode = null;
            secondNode = null;
            ActiveTool=Tools.NODE;
            NodeToolActivated = 1;
            label_info.innerHTML = infoImagePath + 'Selected Node Tool : Now, click anywhere on canvas to add node!';
            break;
        
        case Tools.NODE_SELECTION_STATE:
            label_info.innerHTML = infoImagePath + '<b> Selected node : '+selectedNode.label+'! Click again to open node manager. </b>';
            break;
        
        case Tools.CONNECTION:
            if (selectedNode != null) {
                selectedNode.select(false);
                selectedNode = null;
            }
            ActiveTool=Tools.CONNECTION;
            label_info.innerHTML = infoImagePath + 'Selected Connection Tool : Now, click on any two nodes subsequently to add a connection!';
            break;
        
        default:
            firstNode = null;
            secondNode = null;
            ActiveTool=null;
            if (selectedNode != null) {
                selectedNode.select(false);
                selectedNode = null;
            }
            label_info.innerHTML = '<img src="./Asset/Icons/info.png" alt="Information" width="30px"> Select some tool to start making Topology!';
            break;
    }
}
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: innerWidth/2,
    y: innerHeight/2 
};

let Nodes, Connections;
let NodeToolActivated = 0;
let ports;
let PORT_ID = 0;
let click = 0;
let firstNode = -1;
let isIxiaNode = false;
let secondNode = null;

let NodeIxia, NodeDut;

// something to be done initially, put here...
function init() {
    Nodes = [];
    Connections = [];
    ports = [];
    NodeIxia = [];
    NodeDut = [];
    firstNode = null;
    secondNode = null;
    PORT_ID = 0;
    click = 0;
}

// Animation Loop
function animationLoop() {
    requestAnimationFrame(animationLoop);
    c.clearRect(0, 0, canvas.width, canvas.height);

    Connections.forEach((conn) => {
        conn.update();
    });

    Nodes.forEach((node)=>{
        node.update();
    });

    if(firstNode!=null) {
        // console lines are just for testing 
        // console.log("Drawing ref. line");
        c.beginPath();
        c.strokeStyle = "green";
        c.lineWidth = 5;
        c.setLineDash([5, 5]);
        c.moveTo(firstNode.x, firstNode.y);
        if(secondNode!=null) {
          c.lineTo(secondNode.x,secondNode.y);
        } else {
          c.lineTo(mouse.x,mouse.y);
        }
        c.stroke();
        c.closePath();
    }
}

// What to do when window is resized 
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  
    init();
});

// What to do when mousemove event is occurred 
addEventListener("mousemove",(e)=>{
    // console lines are just for testing 
    // console.log(e.x+" "+e.y);
    mouse.x = e.x;
    mouse.y = e.y;
});
  
// What to do when mouse is clicked...
addEventListener("click",(e) => {
    if (ActiveTool == Tools.NODE) {
       if (NodeToolActivated != 1) {
        lastX = e.clientX;
        lastY = e.clientY;
        ActiveTool = null;
        openNodeConfig();
       }
       NodeToolActivated = 0;
    } else if (ActiveTool == Tools.CONNECTION) {
        if(Nodes.length > 0) {
            Nodes.forEach((node, index) => {
              if(distance(node.x,node.y,mouse.x,mouse.y) <= node.radius) {
                // Just for testing...
                // console.log("Collision with "+index);

                if(node.NodeProperties instanceof Ixia) {
                    isIxiaNode = true;
                } else {
                    isIxiaNode = false;
                }

                click++;
                if(click%2==0) {
                  // it means it's a second click..
                  secondNode = node;
                  openConnectionsConfigurationModal();
                } else {
                  firstNode = node;
                }
              }
            });
        } else {
            selectTool(null);
            openAlertModal("Alert!", "No nodes on the canvas!");
        }
    }
});

init();
animationLoop();


// To calculate the distance between two points in 2D Plane
function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function GenerateCode() {
    if (Nodes.length == 0) { // If there are no nodes on the canvas...
        openAlertModal("Alert!","No nodes on the canvas!");
    } else if (Connections.length == 0) { // If there is no connections on the canvas...
        openAlertModal("Alert!","No connections are made! Please add some!");
    } else {
        let output = "";

        output += "Probable location of the DUTS\n=============================\n";
        Nodes.forEach((node) => {
            if(node.NodeProperties instanceof Dut) {
                output += node.getNodePortableLocation()+"\n";
            }
        });
        output += "\n\n";

        output += "MOVE DUTS\n=============\n";
        Nodes.forEach((node) => {
            if(node.NodeProperties instanceof Dut) {
                output += node.getNodeMovement();
            }
        });
        output += "\n\n";

        output += "IXIA Ports Reserved\n==========================\n";
        Connections.forEach((connection) => {
            // Just for debugging...
            // console.log(connection);
            output += connection.connectionProperties.getIxiaPorts()+"\n";
        });
        output += "\n\n";

        output += "REMOVE CONNECTIONS\n=====================\n**** REMOVE ALL EXISTING CONNECTIONS on above mentioned DUTs and IXIA ports ****\n\n";

        output += "DUT-IXIA Connections:\n========================\n";
        output += ConnectionHelper.getDutToIxiaConnections();
        output += "\n\n";

        output += "DUT-DUT Connections:\n========================\n";
        output += ConnectionHelper.getDutToDutConnections();
        output += "\n\n";

        openOutputModal(output);
    }
}

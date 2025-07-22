const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: innerWidth/2,
    y: innerHeight/2 
};

// Arrays for storing the objects of Node and ConnectionHelper class...
let Nodes, Connections;
// To keep track of user editing, node properties while adding node...
/**
 * Simply put,
 * NodeToolActivated = 0 --> user is not editing the node configuration (Register next clicks)
 * NodeToolActivated = 1 --> user is editing the node configuration (Skip next clicks)
 */
let NodeToolActivated = 0;
// Array for storing the objects of Port class...
let ports;
// keep track of clicks, for connection tool...
let click = 0;
// for connection tool...
let firstNode = -1;
let secondNode = null;
// for node manager modal...
let selectedNode = null;
let selectedConnection = null;

let NodeIxia, NodeDut;

// For enabelling the dragging...
let isDragging = false, isPanning = false;
let draggableNode = null;
let offsetX, offsetY;
let originCanvasX = 0, originCanvasY = 0;
let lastCanvasX = 0, lastCanvasY = 0;

// something to be done initially, put here...
function init() {
    Nodes = [];
    Connections = [];
    ports = [];
    NodeIxia = [];
    NodeDut = [];
    firstNode = null;
    secondNode = null;
    click = 0;
}

// Animation Loop
function animationLoop() {
    requestAnimationFrame(animationLoop);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.setTransform(1, 0, 0, 1, originCanvasX, originCanvasY);

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

window.addEventListener("load",()=> {
    loadSavedTopologies();
    loadSettings();
});

// What to do when window is resized 
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

// What to do when mousemove event is occurred 
canvas.addEventListener("mousemove",(e)=>{
    // console lines are just for testing 
    // console.log(e.x+" "+e.y);
    mouse.x = e.x;
    mouse.y = e.y;

    if(isDragging && draggableNode) {
        draggableNode.x = mouse.x - offsetX;
        draggableNode.y = mouse.y - offsetY;
    } else if (isPanning) {
        const dx = e.offsetX - lastCanvasX;
        const dy = e.offsetY - lastCanvasY;
        originCanvasX += dx;
        originCanvasY += dy;
        lastCanvasX = e.offsetX;
        lastCanvasY = e.offsetY;
    }
});

// Detect mousedown on an Node...
canvas.addEventListener("mousedown", (e) => {
    // find the object from all Nodes...
    const transform = c.getTransform().invertSelf();
    const point = new DOMPoint(mouse.x, mouse.y).matrixTransform(transform);
    draggableNode = Nodes.find(node => 
        distance(node.x, node.y, point.x, point.y) <= node.radius
    );

    // if there exists draggable node...
    if(draggableNode) {
        // calculate the offset...
        isDragging = true;
        isPanning = false;
        offsetX = mouse.x - draggableNode.x;
        offsetY = mouse.y - draggableNode.y;
    } else {
        isPanning = true;
        isDragging = false;
        lastCanvasX = e.offsetX;
        lastCanvasY = e.offsetY;
    }
});

// Detect mouseup to stop the dragging...
canvas.addEventListener("mouseup", (e) => {
    isDragging = false;
    isPanning = false;
    draggableNode = null;
});

canvas.addEventListener("mouseleave", (e) => {
    isDragging = false;
    isPanning = false;
    draggableNode = null;
})
  
// What to do when mouse is clicked...
canvas.addEventListener("click",(e) => {
    if (ActiveTool == Tools.NODE) {
        let collided = false;

        // Check whether it is colliding with some node...
        Nodes.forEach((node) => {
            if(distance(node.x, node.y, mouse.x, mouse.y) <= node.radius) {
                collided = true;
                if (selectedNode == null || selectedNode.NodeProperties.getID()!=node.NodeProperties.getID()) {
                    // unselecting node, if already selected and passed into this condition...
                    if (selectedNode != null) {
                        selectedNode.select(false);
                    }
                    selectedNode = node;
                    selectedNode.select(true);
                    selectTool(Tools.NODE_SELECTION_STATE);
                    // Just for debugging...
                    // console.log("Node Highlighted");
                } else {
                    openNodeManagerModal();
                    ActiveTool = null;
                    // Just for debugging...
                    // console.log("Open Node Manager");
                }
            }
        });

        // if not colliding with some other node...
        if (!collided) {
            if (NodeToolActivated != 1) {
                if (selectedNode == null) {
                    lastX = e.clientX;
                    lastY = e.clientY;
                    ActiveTool = null;
                    openNodeConfig();
                } else {
                    selectTool(Tools.NODE);
                    selectedNode.select(false);
                    selectedNode = null;
                }
            }
            NodeToolActivated = 0;
        }
    } else if (ActiveTool == Tools.CONNECTION) {
        if(Nodes.length > 0) {
            Nodes.forEach((node, index) => {
              if(distance(node.x,node.y,mouse.x,mouse.y) <= node.radius) {
                // Just for testing...
                // console.log("Collision with "+index);
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
        selectTool("none");

        output = generateCode();

        openOutputModal(output);
    }
}

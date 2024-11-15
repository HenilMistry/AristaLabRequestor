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
                click++;
                if(click%2==0) {
                  // it means it's a second click..
                  Connections.push(new ConnectionHelper(firstNode, node, c));
                  console.log(Connections);
                  click = 0;
                  firstNode = null;
                } else {
                  firstNode = node;
                }
              }
            });
        } else {
            alert("No nodes are on the Canvas!");
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

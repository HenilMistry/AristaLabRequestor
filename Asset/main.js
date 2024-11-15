const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: innerWidth/2,
    y: innerHeight/2 
};

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

    }
});  

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
}

// Animation Loop
function animationLoop() {
    requestAnimationFrame(animationLoop);
    c.clearRect(0, 0, canvas.width, canvas.height);

    Nodes.forEach((node)=>{
        node.update();
    });
}

init();
animationLoop();


// To calculate the distance between two points in 2D Plane
function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
  
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
